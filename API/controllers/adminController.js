const User = require('../models/User')
const Post = require('../models/Post')
const BannedUser = require('../models/BannedUser')
const mongoose = require('mongoose')

const {
    sendBanEmail,
    sendUnbanEmail,
    sendOptOutEmail,
    sendPostBanEmail,
    sendPostDeletionEmail
} = require('../common/emailHandler')
const deleteFile = require('../common/deleteFile')

// ========== USERS ==========
const banOrUnbanUser = async(req, res)=>{
    const { name: username } = req.params
    const message = req.body.message || ''
    const loggedUserId = req.id
    const maxMessageLength = 1000

    if(message.length > maxMessageLength)
        return res.status(413).json({ message: "The message is too long" })

    try {
        const mainUser = await User.findById(loggedUserId)
        const bannedUser = await User.findOne({ name: username })
        if(!mainUser || !bannedUser) return res.status(404).json({ message: "User not found" })

        if(bannedUser.roles.find('admin'))
            return res.status(400).json({ message: "You can not ban an admininstrator" })

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
                message: `${bannedUser.name} unbanned successfully`,
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
            msg: `${bannedUser.name} banned successfully`,
            user: userUpdated
        })
    } catch (error) {
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
    }
}

const deleteBannedUser = async(req, res)=>{
    const { name: username } = req.params
    const loggedUserId = req.id

    try{
        const bannedUser = await User.findOne({ name: username })

        if(!bannedUser) return res.status(400).json({ message: "User not found" })
        if(!bannedUser.banned) return res.status(403).json({ message: "This user isn't banned" })

        const latestBan = bannedUser.ban_history[bannedUser.ban_history.length-1]

        let adminUser = await User.findById(latestBan.banned_by)
        if(!adminUser) adminUser = await User.findById(loggedUserId)

        if(adminUser._id != loggedUserId)
            return res.status(409).json({ message: "Only the admin who banned the user can delete it" })

        /*
        const diffInDays = Math.abs(new Date() - latestBan.ban_date) / (1000 * 3600 * 24)
        if(diffInDays < 30)
            return res.status(400).json({ msg: "Você só pode excluir um usuario caso ele esteja + de 30 dias banido" })
        */

        await deleteUser(bannedUser)

        const newBannedUser = new BannedUser({
            email: bannedUser.email,
            ban_message: latestBan.ban_message,
            ban_date: latestBan.ban_date,
            banned_by: latestBan.banned_by
        })
        await newBannedUser.save()

        // await sendOptOutEmail(bannedUser.email, bannedUser.name, adminUser.name, bannedUser.ban_message)
        
        return res.status(200).json({
            message: "Banned user deleted successfully",
            ban_info: bannedUser,
            user: bannedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
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
            return res.status(404).json({ message: "User not found" })

        return res.status(200).json({
            message: "Report deleted successfully",
            user: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
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
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
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
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
    }
}

// =========== POSTS ==========
const banOrUnbanPost = async(req, res)=>{
    const { name: username, posttitle } = req.params
    const message = req.body.message || ''
    const loggedUserId = req.id
    const maxMessageLength = 1000

    if(message.length > maxMessageLength)
        return res.status(413).json({ message: "The message is too long" })

    try {
        const userPost = await User.findOne({ name: username })
        const deletedPost = await Post.findOne({
            title: posttitle,
            user: userPost._id
        })
        if(!deletedPost)
            return res.status(404).json({ message: "User not found" })

        if(deletedPost.banned == "true"){
            await Post.updateOne({
                title: posttitle,
                user: userPost._id
            },
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

            const postUpdated = await Post.findOne({
                title: posttitle,
                user: userPost._id
            }) 
            return res.status(200).json({
                message: `${userPost.name}'s post from ${deletedPost.title} unbanned successfully`,
                post: postUpdated
            })
        }

        await Post.updateOne({
            title: posttitle,
            user: userPost._id
        }, {
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

        const postUpdated = await Post.findOne({
            title: posttitle,
            user: userPost._id
        }) 
        return res.status(200).json({
            msg: `${userPost.name}'s post from ${deletedPost.title} banned successfully`,
            post: postUpdated
        })
    } catch (error) {
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
    }
}

const deleteBannedPost = async(req, res)=>{
    const { name: username, posttitle } = req.params
    const message = req.body.message || ''
    const loggedUserId = req.id
    const maxMessageLength = 1000

    if(message.length > maxMessageLength)
        return res.status(413).json({ message: "The message is too long" })

    try{
        const userPost = await User.findOne({ name: username })
        const deletedPost = await Post.findOne({
            title: posttitle,
            user: userPost._id
        })

        if(!deletedPost)
            return res.status(404).json({ message: "Post not found" })

        const latestBan = deletedPost.ban_history[deletedPost.ban_history.length-1]
        if(deletedPost.banned != "true")
            return res.status(403).json({ message: "This post isn't banned" })
        if(latestBan.banned_by != loggedUserId)
            return res.status(400).json({ message: "Only the admin who banned the post can delete it" })

        //const diffInDays = Math.abs(new Date() - latestBan.ban_date) / (1000 * 3600 * 24)
        //if(diffInDays < 7)
        //    return res.status(400).json({ msg: "Você só pode excluir um post caso ele esteja 7 ou mais dias banido" })

        // delete post
        await await Post.findOneAndDelete({
            title: posttitle,
            user: userPost._id
        })

        for(let i in deletedPost.images)
            deleteFile(deletedPost.files[i].key)

        const adminUser = await User.findById(latestBan.banned_by)
        if(!adminUser) adminUser = await User.findById(loggedUserId)
        
        /* sendPostDeletionEmail(
            userPost.email,
            userPost.name,
            deletedPost.title,
            adminUser.name,
            message
        ) */

        return res.status(200).json({
            msg: "Post deleted successfully",
            post: deletedPost
        })

    } catch (error) {
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
    }
}

const getReportedPosts = async(req, res)=>{
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
        const totalPostsAggregationResult = await User.aggregate([...pipeline, { $count: "total" }])
        const totalPosts = (totalPostsAggregationResult.length > 0) ? totalPostsAggregationResult[0].total : 0
        const totalPages = Math.ceil(totalPosts / pageSize)

        pipeline.push(
            { $sort: { numReports: -1 } },
            { $skip: skipCount },
            { $limit: pageSize }
        )

        const posts = await Post.aggregate(pipeline)

        return res.status(200).json({
            data: posts,
            page,
            pageSize: posts.length,
            maxPageSize: pageSize,
            totalPages
          })
    } catch (error) {
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
    }
}

const getBannedPosts = async(req, res)=>{
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
        const totalPostsAggregationResult = await User.aggregate([...pipeline, { $count: "total" }])
        const totalPosts = (totalPostsAggregationResult.length > 0) ? totalPostsAggregationResult[0].total : 0
        const totalPages = Math.ceil(totalPosts / pageSize)

        pipeline.push(
            { $sort: { "latestBan.ban_date": 1 } },
            { $skip: skipCount },
            { $limit: pageSize }
        )

        const posts = await Post.aggregate(pipeline)

        return res.status(200).json({
            data: posts,
            page,
            pageSize: posts.length,
            maxPageSize: pageSize,
            totalPages
        })
    } catch (error) {
        return res.status(500).json({
            message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        })
    }
}

module.exports = {
    getReportedUsers,
    getBannedUsers,
    banOrUnbanUser,
    deleteBannedUser,
    deleteUserReport,
    getReportedPosts,
    getBannedPosts,
    banOrUnbanPost,
    deleteBannedPost,
}

const deleteUser = async(user)=>{
    // Delete Profile Picture
    if (user.profile_picture.name != 'Doggo.jpg')
      deleteFile(user.profile_picture.key)

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