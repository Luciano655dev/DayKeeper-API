const User = require("../../models/User")
const {
  errors: { notFound, unauthorized, custom: customErr },
  success: { custom }
} = require('../../../constants')

const removeFollower = async(props)=>{
  const { name, loggedUserId } = props

  try{
    const followUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    // validations
    if(!followUser || !mainUser)
      return notFound("User")
    if(!mainUser.private)
      return unauthorized(`remove follower`, "Only private accounts can remove followers")
    if(!mainUser.followers.includes(followUser._id))
      return customErr(404, "This user does not follow you")

    await User.updateOne({ name: mainUser.name }, { $pull: { followers: followUser._id } })
    
    return custom(`${followUser.name} was removed from his followers`)
  }catch(error){
      throw new Error(error.message)
  }
}

module.exports = removeFollower