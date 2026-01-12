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
  maxFollowingCount, // * not using
  errors: { notFound, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const followUser = async (props) => {
  const { username, loggedUser } = props

  try {
    const user = await User.findOne({ username })
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
      return custom(`You unfollowed ${username}`)
    }

    /* To private users */
    if (user.private) {
      if (followRelation && followRelation?.required) {
        /* Remove follow request */
        await Followers.deleteOne({ _id: followRelation._id })
        return custom(`You have withdrawn your request to follow ${username}`)
      }

      /* Send follow request */
      const newFollowRelation = new Followers({
        followerId: loggedUser._id,
        followingId: user._id,
        requested: true,
      })
      await newFollowRelation.save()
      sendNotification(
        user._id,
        newFollowRequestNotification(loggedUser.username)
      )
      return custom(`You sent a follow request to ${username}`)
    }

    const newFollowRelation = new Followers({
      followerId: loggedUser._id,
      followingId: user._id,
    })
    await newFollowRelation.save()

    sendNotification(user._id, newFollowerNotification(loggedUser.username))
    return custom(`You started following ${username}`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = followUser
