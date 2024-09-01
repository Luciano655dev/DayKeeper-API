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

    if (
      loggedUser.roles.includes("admin") ||
      !user.private ||
      user.followers.includes(loggedUser._id) ||
      user._id.toString() == loggedUser._id.toString()
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
