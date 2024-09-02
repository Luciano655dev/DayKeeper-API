const Followers = require("../../models/Followers")
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
    if (isFollowing) status = `following`
    else if (loggedUser.blocked_users.includes(user._id.toString()))
      status = `blocked`
    else if (user._doc._id == loggedUser._id.toString()) status = `logged`
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
    throw new Error(error.message)
  }
}

module.exports = getUser
