const User = require("../../models/User")
const {
  errors: { notFound, unauthorized, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const respondeFollowRequest = async (props) => {
  const { name, response, loggedUser } = props

  try {
    const followUser = await User.findOne({ name })

    /* Validations */
    if (!followUser) return notFound("User")
    if (!loggedUser.private)
      return unauthorized(
        `answer follow request`,
        "Only private accounts can respond to requests"
      )
    if (!loggedUser.follow_requests.includes(followUser._id))
      return customErr(404, "This user did not send you any requests")

    /* Remove user's follow request */
    await User.updateOne(
      { name: loggedUser.name },
      { $pull: { follow_requests: followUser._id } }
    )

    /* DENIED */
    if (!response || response == "false")
      return custom(`You denied ${followUser.name}'s request`)

    /* ACCEPTED */
    await User.updateOne(
      { name: loggedUser.name },
      { $push: { followers: followUser._id } }
    )

    return custom(`You accepted ${followUser.name}'s request`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = respondeFollowRequest
