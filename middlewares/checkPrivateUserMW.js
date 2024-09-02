const Followers = require("../api/models/Followers")
const findUser = require("../api/services/user/get/findUser")
const {
  errors: { serverError },
} = require("../constants/index")

async function checkPrivateUserMW(req, res, next) {
  const { name } = req.params
  const loggedUser = req.user

  try {
    const user = await findUser({ userInput: name, hideData: false })
    if (!user) return res.status(404).json({ message: `User not found` })

    const isFollowing = await Followers.findOne({
      followerId: loggedUser._id,
      followingId: user._id,
      required: { $ne: true },
    })

    if (
      !user.private || // the user is not private
      isFollowing || // the loggedUser is following the user
      user._id.equals(loggedUser._id) // the user is the loggedUser
    )
      return next()

    return res
      .status(401)
      .json({ message: "You can not access a private user's route" })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = checkPrivateUserMW
