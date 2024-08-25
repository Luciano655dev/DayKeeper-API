const User = require("../../models/User")
const mongoose = require("mongoose")
const convertTimeZone = require(`../../utils/convertTimeZone`)
const { hideUserData } = require("../../repositories")
const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getUser = async (props) => {
  const { name: userInput, loggedUser } = props

  try {
    /* Search by name or id */
    let user = await User.findOne({ name: userInput }).select(hideUserData)
    if (!user && mongoose.isValidObjectId(userInput))
      user = await User.findById(String(userInput)).select(hideUserData)

    if (!user) return notFound("User")

    let status = ``
    if (user._doc.followers.includes(loggedUser._id.toString()))
      status = `following`
    else if (loggedUser.blocked_users.includes(user._id.toString()))
      status = `blocked`
    else if (user._doc._id == loggedUser._id.toString()) status = `logged`
    else status = `default`

    return fetched(`user`, {
      user: {
        ...user._doc,
        followers: user._doc.followers.length,
        created_at: convertTimeZone(user.created_at, loggedUser.timeZone),
        status,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getUser
