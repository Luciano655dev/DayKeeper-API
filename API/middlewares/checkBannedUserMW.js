const User = require('../models/User')

async function checkBannedUserMW(req, res, next){
    const { name } = req.params

    try{
        const user = await User.findOne({ name })

        if(user.banned == "true")
            return res.status(402).json({ message: "This user is banned" })

        next()
    }catch(error){
        return handleBadRequest(500,
            `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        )
    }
}

module.exports = checkBannedUserMW