const User = require("../../models/User")
const CloseFriends = require("../../models/CloseFriends")

const {
  errors: { notFound, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const addOrRemoveFromCloseFriends = async (props) => {
  const { name, loggedUser } = props

  try {
    const user = await User.findOne({ name })
    if (!user) return notFound("User")

    if (user._id.equals(loggedUser._id))
      return customErr(`you can not add yourself to your close friends`)

    const closeFriendsRelation = await CloseFriends.findOne({
      userId: loggedUser._id,
      closeFriendId: user._id,
    })

    /* Remove from CF */
    if (closeFriendsRelation) {
      await CloseFriends.deleteOne({ _id: closeFriendsRelation._id })
      return custom(`You removed ${name} from your Close Friends`)
    }

    /* Add to CF */
    const newCloseFriendsRelation = new CloseFriends({
      userId: loggedUser._id,
      closeFriendId: user._id,
    })
    await newCloseFriendsRelation.save()

    return custom(`You added ${name} to your Close Friends`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = addOrRemoveFromCloseFriends
