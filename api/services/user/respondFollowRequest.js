const findUser = require("../user/get/findUser")
const Followers = require("../../models/Followers")
const {
  errors: { notFound, unauthorized, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const respondeFollowRequest = async (props) => {
  const { username, response, loggedUser } = props

  try {
    const followUser = await findUser({ userInput: username })
    if (!followUser) return notFound("User")

    const followRelation = await Followers.findOne({
      followerId: followUser._id,
      followingId: loggedUser._id,
      required: true,
    })

    /* Validations */
    if (!loggedUser.private)
      return unauthorized(
        `answer follow request`,
        "Only private accounts can respond to requests"
      )
    if (!followRelation)
      return customErr("This user did not send you any requests", null, 404)

    /* DENIED */
    if (!response || response == "false") {
      await followRelation.remove()
      return custom(`You denied ${followUser.username}'s request`)
    }

    /* ACCEPTED */
    followRelation.required = undefined
    await followRelation.save()

    return custom(`You accepted ${followUser.username}'s request`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = respondeFollowRequest
