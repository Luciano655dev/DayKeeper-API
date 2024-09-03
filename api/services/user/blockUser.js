const findUser = require("./get/findUser")
const Blocks = require("../../models/Blocks")
const Followers = require("../../models/Followers")
const {
  errors: { notFound, custom: customErr },
  success: { custom },
} = require("../../../constants/index")

const blockUser = async (props) => {
  const { name, loggedUser } = props

  try {
    const blockedUser = await findUser({ userInput: name })

    /* Validations */
    if (!blockedUser) return notFound("User")
    if (blockedUser.name == loggedUser.name)
      return customErr(409, `You can not block yourself`)

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
      return custom(`${name} successfully unblocked`)
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

    return custom(`${name} successfully blocked`)
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = blockUser
