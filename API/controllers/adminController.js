const User = require('../models/User')
const Post = require('../models/Post')

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

        if(bannedUser.banned){
            await User.updateOne({ name: username }, {
                $set: {
                    unbanned_by: loggedUserId,
                    unban_date: Date.now(),
                    unban_message: message
                },
                $unset: {
                    banned: '',
                    banned_by: '',
                    ban_date: '',
                    ban_message: ''
                }
            })

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
                banned_by: loggedUserId,
                ban_date: Date.now(),
                ban_message: message
            },
            $unset: {
                unbanned_by: '',
                unban_date: '',
                unban_message: ''
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

        let adminUser = await User.findById(bannedUser.banned_by)

        // caso o admin quebaniu não existe, esse novo admin tomará o lugar dele
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

// Get Users Reports
// Get Users that The Admin Banned
// Delete user Report

module.exports = {
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