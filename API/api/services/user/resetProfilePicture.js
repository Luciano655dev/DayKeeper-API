const User = require('../../models/User')
const { notFound, defaultPfp } = require('../../../constants')

const reseteProfilePicture = async(props)=>{
    const { loggedUserId } = props

    try{
      // delete last PFP
      const user = await User.findById(loggedUserId)
      if(!user) return { code: 404, message: notFound("User") }
  
      if(user.profile_picture.key == defaultPfp.key)
        return { code: 400, message: "Sour profile photo is already the default" }
  
      // deleteLastPFP
      if (user.profile_picture.name != defaultPfp.name)
        deleteFile(user.profile_picture.key)
  
      const updatedUser = await User.findByIdAndUpdate(loggedUserId,
        {
          $set: {
            profile_picture: defaultPfp,
          },
        }
      )
      await updatedUser.save()
  
      return { code: 200, message: `${user.name}'s profile picture reseted successfully` }
    } catch (error){
      throw new Error(error.message)
    }
}

module.exports = reseteProfilePicture