const User = require('../api/models/User')
const { errors: { serverError } } = require('../constants/index')

async function checkPrivateUserMW(req, res, next){
    const { name } = req.params
    const loggedUser = req.user

    try{
        const user = await User.findOne({ name })
        if(!user) return res.status(404).json({ message: `User not found` })

        if(
            loggedUser.roles.includes('admin') ||
            !user.private ||
            user.followers.includes(loggedUser._id) ||
            user._id == loggedUser._id
        ) return next()

        return res.status(401).json({ message: "You can not access a private user's route" })
    }catch(error){
        return res.status(500).json({ message: serverError(error.message).message })
    }
}

module.exports = checkPrivateUserMW