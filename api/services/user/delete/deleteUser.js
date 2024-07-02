const User = require('../../../models/User')

const deleteUser = async(loggedUserId)=>{
    try{
        const response = await User.findByIdAndDelete(loggedUserId)

        return response.nModified
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = deleteUser