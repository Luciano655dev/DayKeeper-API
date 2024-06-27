const { serverError } = require('../constants/index')

async function checkBannedUserMW(req, res, next){
    const loggedUser = req.user

    try{
        if(loggedUser.roles.includes('admin'))
            return next()

        return res.status(402).json({ message: "Only administrators can access this route" })
    }catch(error){
        return handleBadRequest(500, serverError(error.message).message)
    }
}

module.exports = checkBannedUserMW