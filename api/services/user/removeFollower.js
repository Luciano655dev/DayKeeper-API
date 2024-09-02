const findUser = require("../user/get/findUser")
const Followers = require("../../models/Followers")
const {
  errors: { notFound, unauthorized, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const removeFollower = async (props) => {
  const { name, loggedUser } = props

  try {
    const followUser = await findUser({ userInput: name })
    if (!followUser) return notFound("User")

    const followRelation = await Followers.findOne({
      followerId: followUser._id,
      followingId: loggedUser._id,
      required: { $ne: true },
    })

    // validations
    if (!loggedUser.private)
      return unauthorized(
        `remove follower`,
        "Only private accounts can remove followers"
      )
    if (!followRelation) return customErr(404, "This user does not follow you")

    await Followers.deleteOne({
      followerId: followUser._id,
      followingId: loggedUser._id,
    })

    return custom(`${followUser.name} was removed from his followers`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = removeFollower
