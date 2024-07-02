const User = require(`../../../models/User`)
const mongoose = require(`mongoose`)

const findUser = async(userInput)=>{
    try {
        let user = await User.findOne({ name: userInput })
        if(!user && mongoose.Types.ObjectId.isValid(userInput))
            user = await User.findById(userInput)
        if(!user)
            return null

        return user
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = findUser