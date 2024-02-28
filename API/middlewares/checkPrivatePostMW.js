const User = require('../models/User')

async function checkPrivatePostMW(req, res, next){
    const { name } = req.params
    const loggedUserId = req.id

    try{
        const user = await User.findOne({ name })

        if(
            !user.private || // se o usar não for privado
            user.followers.includes(loggedUserId) || // se estiver dentro dos seguidores
            user._id == loggedUserId // se não for o post do usuario
        ) return next()

        return res.status(401).json({ msg: 'Você não pode acessar esse post!' })

    }catch(error){
        return res.status(500).json({ error })
    }
}

module.exports = checkPrivatePostMW