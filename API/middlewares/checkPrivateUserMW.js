const User = require('../models/User')

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

        return res.status(401).json({ msg: 'Você não pode acessar essa página!' })

    }catch(error){
        return res.status(500).json({ error })
    }
}

module.exports = checkPrivateUserMW