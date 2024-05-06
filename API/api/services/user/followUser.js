const User = require("../../models/User")
const { notFound } = require('../../../constants')

const followUser = async(props)=>{
    const { name, loggedUserId } = props
  
    try {
      const user = await User.findOne({ name })
      if (!user)
        return res.status(404).json({ message: notFound('User') })
  
      if(user._id == loggedUserId)
        return res.status(400).json({ message: "You can't follow yourself" })
  
      /* Stop following */
      if (user.followers.includes(loggedUserId)) {
        await User.updateOne({ name }, { $pull: { followers: loggedUserId } })
        return { code: 200, message: `You unfollowed ${name}` }
      }
  
      /* To private users */
      if(user.private){
        if(user.follow_requests.includes(loggedUserId)){
          /* Remove follow request */
          await User.updateOne({ name }, { $pull: { follow_requests: loggedUserId } })
          return { code: 200, message: `You have withdrawn your request to follow  ${name}` }
        }
  
        /* Send follow request */
        await User.updateOne({ name }, { $push: { follow_requests: loggedUserId } })
        return { code: 200, message: `You sent a follow request to ${name}` }
      }
  
      await User.updateOne({ name }, { $push: { followers: loggedUserId } })
  
      return { code: 200, message: `You started following ${name}` }
    } catch (error) {
      throw new Error(error.message)
    }
}

module.exports = followUser