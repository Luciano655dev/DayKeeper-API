const User = require('../api/models/User')
const { serverError } = require('../constants/index')

async function checkBlockedUserMW(req, res, next){
    const { name } = req.params
    const loggedUser = req.user

    try{
        const blockedUser = await User.findOne({ name })

        if(
            !loggedUser.blocked_users.includes(blockedUser._id) &&
            !blockedUser.blocked_users.includes(loggedUser._id)
        ) return next()

        return res.status(402).json({ message: "This user blocked you or you blocked him" })
    }catch(error){
        return res.status(500).json({ message: serverError(error.message) })
    }
}

module.exports = checkBlockedUserMW