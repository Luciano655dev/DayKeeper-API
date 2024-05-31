const User = require('../api/models/User')
const { errors: { serverError } } = require('../constants')

async function checkBannedUserMW(req, res, next){
    const { name } = req.params

    try{
        const user = await User.findOne({ name })

        if(user.banned == "true")
            return res.status(402).json({ message: "This user is banned" })

        next()
    }catch(error){
        return res.status(500).json({ message: serverError(error.message) })
    }
}

module.exports = checkBannedUserMW