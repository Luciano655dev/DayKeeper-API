const User = require('../models/User')
const Post = require('../models/Post')

const {
    sendBanEmail,
    sendUnbanEmail
    // send exclusion email
} = require('../common/emailHandler')

const banOrUnbanUser = async(req, res)=>{
    const { name: username } = req.params
    const message = req.body.message || ''
    const loggedUserId = req.id

    if(message.length > 1000)
        return res.status(400).json({ msg: "A mensagem precisa ter menos de 1000 caracteres" })

    try {
        const mainUser = await User.findById(loggedUserId)
        const postUser = await User.findOne({ name: username })
        if(!mainUser || !postUser) return res.status(404).json({ msg: "Usuario não encontrado" })

        if(postUser.banned){
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

            // await sendUnbanEmail(postUser.email, postUser.name, mainUser.name, message)

            const userUpdated = await User.findOne({ name: username }) 
            return res.status(200).json({
                msg: `Usuário ${postUser.name} desbanido com sucesso`,
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

        // await sendBanEmail(postUser.email, postUser.name, mainUser.name, message)

        const userUpdated = await User.findOne({ name: username }) 
        return res.status(200).json({
            msg: `Usuario ${postUser.name} banido com sucesso`,
            user: userUpdated
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

// Get Users Reports
// Get +15days banned users
// Delete User (After 15 days)

module.exports = {
    banOrUnbanUser
}