const User = require('../api/models/User')
const { serverError } = require('../constants')

async function checkPrivateUserMW(req, res, next){
    const { name } = req.params
    const loggedUserId = req.id

    try{
        const user = await User.findOne({ name })
        if(!user) return res.status(404).json({ message: `User not found` })

        if(
            !user.private ||
            user.followers.includes(loggedUserId) ||
            user._id == loggedUserId
        ) return next()

        return res.status(401).json({ message: "You can not access a private user's route" })
    }catch(error){
        return res.status(500).json({ message: serverError(error.message) })
    }
}

module.exports = checkPrivateUserMW