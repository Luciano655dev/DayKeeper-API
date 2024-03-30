const User = require('../models/User')
const Post = require('../models/Post')
const mongoose = require('mongoose')

const {
    sendBanEmail,
    sendUnbanEmail,
    sendOptOutEmail
} = require('../common/emailHandler')
const deleteImage = require('../common/deleteImage')

const banOrUnbanUser = async(req, res)=>{
    const { name: username } = req.params
    const message = req.body.message || ''
    const loggedUserId = req.id

    if(message.length > 1000)
        return res.status(400).json({ msg: "A mensagem precisa ter menos de 1000 caracteres" })

    try {
        const mainUser = await User.findById(loggedUserId)
        const bannedUser = await User.findOne({ name: username })
        if(!mainUser || !bannedUser) return res.status(404).json({ msg: "Usuario não encontrado" })

        if(bannedUser.banned == "true"){
            await User.updateOne({ name: username },
                {
                    $set: {
                        banned: false,
                        "ban_history.$[elem].unban_date": Date.now(),
                        "ban_history.$[elem].unbanned_by": loggedUserId,
                        "ban_history.$[elem].unban_message": message
                    }
                },
                {
                    arrayFilters: [{ "elem.unban_date": { $exists: false } }]
                }
            )

            // await sendUnbanEmail(bannedUser.email, bannedUser.name, mainUser.name, message)

            const userUpdated = await User.findOne({ name: username }) 
            return res.status(200).json({
                msg: `Usuário ${bannedUser.name} desbanido com sucesso`,
                user: userUpdated
            })
        }

        await User.updateOne({ name: username }, {
            $set: {
                banned: true,
            },
            $push: {
                ban_history: {
                    banned_by: loggedUserId,
                    ban_date: Date.now(),
                    ban_message: message
                }
            }
        })

        // await sendBanEmail(bannedUser.email, bannedUser.name, mainUser.name, message)

        const userUpdated = await User.findOne({ name: username }) 
        return res.status(200).json({
            msg: `Usuario ${bannedUser.name} banido com sucesso`,
            user: userUpdated
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const deleteBannedUser = async(req, res)=>{
    const { name: username } = req.params
    const loggedUserId = req.id

    try{
        const bannedUser = await User.findOne({ name: username })

        if(!bannedUser) return res.status(400).json({ msg: "Usuario não encontrado" })
        if(!bannedUser.banned) return res.status(400).json({ msg: "Este usuario não foi banido" })

        let adminUser = await User.findById(bannedUser.banHistory[bannedUser.banHistory.length-1].banned_by)

        // caso o admin que baniu pela última vez não exista mais, o adm logado tomará seu lugar
        if(!adminUser) adminUser = await User.findById(loggedUserId)

        if(adminUser._id != loggedUserId)
            return res.status(400).json({ msg: "Apenaso admin que baniu o usuario pode exclui-lo" })

        const diffInDays = Math.abs(new Date() - bannedUser.ban_date) / (1000 * 3600 * 24)
        if(diffInDays < 30)
            return res.status(400).json({ msg: "Você só pode excluir um usuario caso ele esteja + de 30 dias banido" })

        await deleteUser(bannedUser)

        // await sendOptOutEmail(bannedUser.email, bannedUser.name, adminUser.name, bannedUser.ban_message)
        
        return res.status(200).json({
            msg: "O usuario banido e suas ações foram deletadas com sucesso, um email foi enviado notificando o usuario",
            user: bannedUser
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const deleteUserReport = async(req, res)=>{
    const { name: username, reportId } = req.params

    try{
        const updatedUser = await User.findOneAndUpdate({ name: username }, {
            $pull: {
                reports: { _id: reportId }
            }
        }, { new: true })

        if(!updatedUser)
            return res.status(404).json({ msg: "Usuario não encontrado" })

        return res.status(200).json({
            msg: "Report excluido com sucesso",
            user: updatedUser
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const getReportedUsers = async(req, res)=>{
    const page = Number(req.query.page) || 1
    const pageSize = req.query.pageSize ? ( Number(req.query.pageSize) <= 100 ? Number(req.query.pageSize) : 100) : 1
    const skipCount = (page - 1) * pageSize

    const pipeline = [
        {
          $match: {
              $and: [
                { 
                    'banned': "false"
                },
                {
                    reports: {
                        $exists: true,
                        $not: {
                        $size: 0
                        }
                    }
                }
              ]
          },
        },
        {
            $addFields: {
                numReports: { $size: "$reports" }
              },
        }
    ]

    try{
        const totalUsersAggregationResult = await User.aggregate([...pipeline, { $count: "total" }])
        const totalUsers = (totalUsersAggregationResult.length > 0) ? totalUsersAggregationResult[0].total : 0
        const totalPages = Math.ceil(totalUsers / pageSize)

        pipeline.push(
            { $sort: { numReports: -1 } },
            { $skip: skipCount },
            { $limit: pageSize }
        )

        const users = await User.aggregate(pipeline)

        return res.status(200).json({
            data: users,
            page,
            pageSize: users.length,
            maxPageSize: pageSize,
            totalPages
          })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const getBannedUsers = async(req, res)=>{
    const loggedUserId = new mongoose.Types.ObjectId(req.id)

    const page = Number(req.query.page) || 1
    const pageSize = req.query.pageSize ? ( Number(req.query.pageSize) <= 100 ? Number(req.query.pageSize) : 100) : 1
    const skipCount = (page - 1) * pageSize

    const pipeline = [
        {
            $addFields: {
                latestBan: {
                    $arrayElemAt: ["$ban_history", -1]
                }
            }
        },
        {
            $match: {
                $and: [
                    {
                        'banned': "true"
                    },
                    {
                        "latestBan.banned_by": loggedUserId
                    }
                ]
            }
        }
    ]
    

    try{
        const totalUsersAggregationResult = await User.aggregate([...pipeline, { $count: "total" }])
        const totalUsers = (totalUsersAggregationResult.length > 0) ? totalUsersAggregationResult[0].total : 0
        const totalPages = Math.ceil(totalUsers / pageSize)

        pipeline.push(
            { $sort: { "latestBan.ban_date": 1 } },
            { $skip: skipCount },
            { $limit: pageSize }
        )

        const users = await User.aggregate(pipeline)

        return res.status(200).json({
            data: users,
            page,
            pageSize: users.length,
            maxPageSize: pageSize,
            totalPages
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

module.exports = {
    getReportedUsers,
    getBannedUsers,
    banOrUnbanUser,
    deleteBannedUser,
    deleteUserReport
}

const deleteUser = async(user)=>{
    // Delete Profile Picture
    if (user.profile_picture.name != 'Doggo.jpg')
      deleteImage(user.profile_picture.key)

    // Delete all reactions by the user in any post
    await Post.updateMany({}, {
      $pull: {
        reactions: { user: user._id }
      }
    })
    
    // Delete all comments by the user in any post
    await Post.updateMany({}, {
      $pull: {
        comments: { user: user._id }
      }
    })

    // Delete all reactions by the user in any comment
    await Post.updateMany({}, {
      $pull: {
        'comments.$[].reactions': { user: user._id }
      }
    })

    // delete all his followers
    await Post.updateMany({}, {
      $pull: {
        followers: { user: user._id }
      }
    })

    // delete all his follow requests
    await Post.updateMany({}, {
      $pull: {
        follow_requests: { user: user._id }
      }
    })

    // Delete user's posts
    await Post.deleteMany({ user: user._id })

    // Delete account
    await User.findByIdAndDelete(user._id)
}