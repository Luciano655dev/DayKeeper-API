const User = require('../api/models/User')
const { serverError } = require('../constants/index')

async function checkBannedUserMW(req, res, next){
    const loggedUserId = req.id

    try{
        const user = await User.findById(loggedUserId)

        if(user.roles.includes('admin'))
            return next()

        return res.status(402).json({ message: "Only administrators can access this route" })
    }catch(error){
        return handleBadRequest(500, serverError(error.message))
    }
}

module.exports = checkBannedUserMW