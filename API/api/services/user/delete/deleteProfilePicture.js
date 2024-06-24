const deleteFile = require('../../../utils/deleteFile')
const { defaultPfp } = require('../../../../constants/index')

const deleteProfilePicture = async(user)=>{
    try{
        if (user.profile_picture.name != defaultPfp.name)
            deleteFile(user.profile_picture.key)
    
        return user.profile_picture
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = deleteProfilePicture