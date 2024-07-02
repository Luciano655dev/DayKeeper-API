const User = require("../../models/User")
const {
  errors: { notFound, unauthorized, custom: customErr },
  success: { custom }
} = require('../../../constants/index')

const removeFollower = async(props)=>{
  const { name, loggedUser } = props

  try{
    const followUser = await User.findOne({ name })

    // validations
    if(!followUser)
      return notFound("User")
    if(!loggedUser.private)
      return unauthorized(`remove follower`, "Only private accounts can remove followers")
    if(!loggedUser.followers.includes(followUser._id))
      return customErr(404, "This user does not follow you")

    await User.updateOne({ name: loggedUser.name }, { $pull: { followers: followUser._id } })
    
    return custom(`${followUser.name} was removed from his followers`)
  }catch(error){
      throw new Error(error.message)
  }
}

module.exports = removeFollower