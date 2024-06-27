const User = require('../../models/User')

const {
  user: { defaultPfp },
  errors: { notFound, custom: customErr },
  success: { reseted }
} = require('../../../constants/index')

const reseteProfilePicture = async(props)=>{
    const { loggedUser } = props

    try{
      if(loggedUser.profile_picture.key == defaultPfp.key)
        return customErr("Sour profile photo is already the default")
  
      // deleteLastPFP
      if (loggedUser.profile_picture.name != defaultPfp.name)
        deleteFile(loggedUser.profile_picture.key)
  
      const updatedUser = await User.findByIdAndUpdate(loggedUser._id,
        {
          $set: {
            profile_picture: defaultPfp,
          },
        }
      )
      await updatedUser.save()
  
      return reseted(`${loggedUser.name}'s profile picture reseted successfully`)
    } catch (error){
      throw new Error(error.message)
    }
}

module.exports = reseteProfilePicture