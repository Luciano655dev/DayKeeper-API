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

        return res.status(401).json({ msg: 'Este usuário te bloqueou ou você o bloqueou' })

    }catch(error){
        return res.status(500).json({ error })
    }
}

module.exports = checkBlockedUserMW