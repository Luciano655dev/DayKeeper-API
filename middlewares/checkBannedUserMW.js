const findUser = require("../api/services/user/get/findUser")
const {
  errors: { serverError },
} = require("../constants/index")

async function checkBannedUserMW(req, res, next) {
  const { username } = req.params

  try {
    const user = await findUser({ userInput: username, hideData: false })
    if (!user) return res.status(404).json({ message: `User not found` })

    req.fetchedUser = user

    if (!user?.banned)
      return res.status(402).json({ message: "This user is banned" })

    next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = checkBannedUserMW
