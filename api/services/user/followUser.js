const User = require("../../models/User")
const Followers = require("../../models/Followers")
const sendNotification = require("../../utils/sendNotification")

const {
  notifications: {
    follow: {
      newFollower: newFollowerNotification,
      newFollowRequest: newFollowRequestNotification,
    },
  },
  maxFollowingCount, // not using
  errors: { notFound, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const followUser = async (props) => {
  const { name, loggedUser } = props

  try {
    const user = await User.findOne({ name })
    if (!user) return notFound("User")

    if (user._id.equals(loggedUser._id))
      return customErr(`you can not follow yourself`)

    const followRelation = await Followers.findOne({
      followerId: loggedUser._id,
      followingId: user._id,
    })

    /* Stop following */
    if (followRelation && !followRelation?.requested) {
      await Followers.deleteOne({ _id: followRelation._id })
      return custom(`You unfollowed ${name}`)
    }

    /* To private users */
    if (user.private) {
      if (followRelation && followRelation?.required) {
        /* Remove follow request */
        await Followers.deleteOne({ _id: followRelation._id })
        return custom(`You have withdrawn your request to follow ${name}`)
      }

      /* Send follow request */
      const newFollowRelation = new Followers({
        followerId: loggedUser._id,
        followingId: user._id,
        requested: true,
      })
      await newFollowRelation.save()
      sendNotification(user._id, newFollowRequestNotification(loggedUser.name))
      return custom(`You sent a follow request to ${name}`)
    }

    const newFollowRelation = new Followers({
      followerId: loggedUser._id,
      followingId: user._id,
    })
    await newFollowRelation.save()

    sendNotification(user._id, newFollowerNotification(loggedUser.name))
    return custom(`You started following ${name}`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = followUser
