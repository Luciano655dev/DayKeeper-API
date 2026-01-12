const findUser = require("./get/findUser")
const Blocks = require("../../models/Blocks")
const Followers = require("../../models/Followers")
const {
  errors: { notFound, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const blockUser = async (props) => {
  const { username, loggedUser } = props

  try {
    const blockedUser = await findUser({ userInput: username })

    /* Validations */
    if (!blockedUser) return notFound("User")
    if (blockedUser.username == loggedUser.username)
      return customErr(`You can not block yourself`)

    /* Unblock */
    const blockRelation = await Blocks.findOne({
      blockId: loggedUser._id,
      blockedId: blockedUser._id,
    })
    if (blockRelation) {
      // if the user is already blocked
      await Blocks.deleteOne({
        blockId: loggedUser._id,
        blockedId: blockedUser._id,
      })
      return custom(`${username} unblocked successfully`)
    }

    /* Block */
    const newBlockRelation = new Blocks({
      blockId: loggedUser._id,
      blockedId: blockedUser._id,
    })
    await newBlockRelation.save()

    // delete follows and follow request between the users
    await Followers.deleteMany({
      $or: [
        { followerId: loggedUser._id, followingId: blockedUser._id },
        { followerId: blockedUser._id, followingId: loggedUser._id },
      ],
    })

    return custom(`${username} blocked successfully`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = blockUser
