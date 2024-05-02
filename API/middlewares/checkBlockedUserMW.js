const User = require('../models/User')

async function checkBlockedUserMW(req, res, next){
    const { name } = req.params
    const loggedUserId = req.id

    try{
        const mainUser = await User.findById(loggedUserId)
        const blockedUser = await User.findOne({ name })

        if(
            !mainUser.blocked_users.includes(blockedUser._id) &&
            !blockedUser.blocked_users.includes(mainUser._id)
        ) return next()

        return res.status(402).json({ message: "This user blocked you or you blocked him" })

    }catch(error){
        return handleBadRequest(500,
            `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        )
    }
}

module.exports = checkBlockedUserMW