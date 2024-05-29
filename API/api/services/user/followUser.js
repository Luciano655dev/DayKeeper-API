const User = require("../../models/User")
const {
  errors: { notFound, custom: customErr },
  success: { custom }
} = require('../../../constants')

const followUser = async(props)=>{
  const { name, loggedUserId } = props

  try {
    const user = await User.findOne({ name })
    if (!user)
      return notFound('User') 

    if(user._id == loggedUserId)
      return customErr(`you can not follow yourself`)

    /* Stop following */
    if (user.followers.includes(loggedUserId)) {
      await User.updateOne({ name }, { $pull: { followers: loggedUserId } })
      return custom(`You unfollowed ${name}`)
    }

    /* To private users */
    if(user.private){
      if(user.follow_requests.includes(loggedUserId)){
        /* Remove follow request */
        await User.updateOne({ name }, { $pull: { follow_requests: loggedUserId } })
        return custom(`You have withdrawn your request to follow ${name}`)
      }

      /* Send follow request */
      await User.updateOne({ name }, { $push: { follow_requests: loggedUserId } })
      return custom(`You sent a follow request to ${name}`)
    }

    await User.updateOne({ name }, { $push: { followers: loggedUserId } })

    return custom(`You started following ${name}` )
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = followUser