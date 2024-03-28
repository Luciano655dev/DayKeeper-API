const User = require('../models/User')

async function checkBannedUserMW(req, res, next){
    const { name } = req.params

    try{
        const user = await User.findOne({ name })

        if(user.banned)
            return res.status(401).json({ msg: "Este usuario foi banido" })

        next()
    }catch(error){
        return res.status(500).json({ error })
    }
}

module.exports = checkBannedUserMW