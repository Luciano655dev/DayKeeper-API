const User = require("../../models/User")
const {
  errors: { notFound, custom: customErr },
  success: { custom }
} = require('../../../constants/index')

const followUser = async(props)=>{
  const { name, loggedUser } = props

  try {
    const user = await User.findOne({ name })
    if (!user)
      return notFound('User') 

    if(user._id == loggedUser._id)
      return customErr(`you can not follow yourself`)

    /* Stop following */
    if (user.followers.includes(loggedUser._id)) {
      await User.updateOne({ name }, { $pull: { followers: loggedUser._id } })
      return custom(`You unfollowed ${name}`)
    }

    /* To private users */
    if(user.private){
      if(user.follow_requests.includes(loggedUser._id)){
        /* Remove follow request */
        await User.updateOne({ name }, { $pull: { follow_requests: loggedUser._id } })
        return custom(`You have withdrawn your request to follow ${name}`)
      }

      /* Send follow request */
      await User.updateOne({ name }, { $push: { follow_requests: loggedUser._id } })
      return custom(`You sent a follow request to ${name}`)
    }

    await User.updateOne({ name }, { $push: { followers: loggedUser._id } })

    return custom(`You started following ${name}`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = followUser