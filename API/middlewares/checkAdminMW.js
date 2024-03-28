const User = require('../models/User')

async function checkBannedUserMW(req, res, next){
    const loggedUserId = req.id

    try{
        const user = await User.findById(loggedUserId)

        if(user.roles.includes('admin'))
            return next()

        return res.status(401).json({ msg: "Apenas admininstradores podem acessar essa rota" })
    }catch(error){
        return res.status(500).json({ error })
    }
}

module.exports = checkBannedUserMW