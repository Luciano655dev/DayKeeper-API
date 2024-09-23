const Followers = require("../../models/Followers")
const Blocks = require("../../models/Blocks")
const findUser = require("./get/findUser")
const convertTimeZone = require(`../../utils/convertTimeZone`)
const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getUser = async (props) => {
  const { name: userInput, loggedUser } = props

  try {
    /* Search by name or id */
    let user = await findUser({ userInput, hideData: true })
    if (!user) return notFound("User")

    let status = ``
    const followerCounter = await Followers.countDocuments({
      followingId: user._id,
    })
    const isFollowing = await Followers.findOne({
      followerId: loggedUser._id,
      followingId: user._id,
    })

    const isBlocked = await Blocks.findOne({
      blockId: user._id,
      blockedId: loggedUser._id,
    })

    if (isFollowing) status = `following`
    else if (isBlocked) status = `blocked`
    else if (user._doc._id.equals(loggedUser._id)) status = `logged`
    else status = `default`

    return fetched(`user`, {
      user: {
        ...user._doc,
        followers: followerCounter,
        created_at: convertTimeZone(user.created_at, loggedUser.timeZone),
        status,
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = getUser
