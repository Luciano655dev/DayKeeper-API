const User = require('../api/models/User')

async function checkPrivateUserMW(req, res, next){
    const { name } = req.params
    const loggedUserId = req.id

    try{
        const user = await User.findOne({ name })

        if(
            !user.private ||
            user.followers.includes(loggedUserId) ||
            user._id == loggedUserId
        ) return next()

        return res.status(401).json({ message: "You can not access a private user's route" })

    }catch(error){
        return handleBadRequest(500,
            `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        )
    }
}

module.exports = checkPrivateUserMW