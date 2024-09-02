const findUser = require("../user/get/findUser")
const Followers = require("../../models/Followers")
const {
  errors: { notFound, unauthorized, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const respondeFollowRequest = async (props) => {
  const { name, response, loggedUser } = props

  try {
    const followUser = await findUser({ userInput: name })
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
      return customErr(404, "This user did not send you any requests")

    /* DENIED */
    if (!response || response == "false") {
      await followRelation.remove()
      return custom(`You denied ${followUser.name}'s request`)
    }

    /* ACCEPTED */
    followRelation.required = undefined
    await followRelation.save()

    return custom(`You accepted ${followUser.name}'s request`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = respondeFollowRequest
