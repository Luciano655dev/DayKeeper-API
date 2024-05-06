const User = require("../../models/User")
const { notFound } = require('../../../constants')

const removeFollower = async(props)=>{
    const { name, loggedUserId } = props
  
    try{
      const followUser = await User.findOne({ name })
      const mainUser = await User.findById(loggedUserId)
  
      // validations
      if(!followUser || !mainUser)
        return { code: 404, message: notFound("User") }
      if(!mainUser.private)
        return { code: 403, message: "Only private accounts can remove followers" }
      if(!mainUser.followers.includes(followUser._id))
        return { code: 404, message: "This user does not follow you" }
  
      await User.updateOne({ name: mainUser.name }, { $pull: { followers: followUser._id } })
      
      return { code: 200, message: `${followUser.name} was removed from his followers` }
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = removeFollower