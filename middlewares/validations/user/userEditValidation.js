const User = require("../../../api/models/User")
const bcrypt = require("bcryptjs")
const deleteFile = require("../../../api/utils/deleteFile")

const {
  auth: { maxEmailLength, maxBioLength, maxUsernameLength, maxPasswordLength },
  errors: { serverError },
} = require("../../../constants/index")

const userValidation = async (req, res, next) => {
  let { username, email, password, bio, lastPassword } = req.body

  const handleBadRequest = (status, message) => {
    if (req.file) deleteFile({ key: req.file.key })
    return res.status(status).json({ message })
  }

  try {
    // normalize
    username = typeof username === "string" ? username.trim() : undefined
    email = typeof email === "string" ? email.trim().toLowerCase() : undefined
    bio = typeof bio === "string" ? bio : undefined

    // load fresh user with password (don’t trust req.user snapshot)
    const loggedUser = await User.findById(req.user._id).select(
      "email username password profile_picture private"
    )
    if (!loggedUser) return handleBadRequest(404, "User not found")

    // Input validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (
      email &&
      (!emailRegex.test(email) ||
        email.length === 0 ||
        email.length > maxEmailLength)
    ) {
      return handleBadRequest(400, "Enter a valid email")
    }

    if (bio && bio.length > maxBioLength) {
      return handleBadRequest(413, "Bio is too long")
    }

    if (username && username.length > maxUsernameLength) {
      return handleBadRequest(413, "Username is too long")
    }

    if (password) {
      if (password.length > maxPasswordLength) {
        return handleBadRequest(413, "Password is too long")
      }

      if (!lastPassword) {
        return handleBadRequest(400, "Last password is required")
      }

      const ok = await bcrypt.compare(lastPassword, loggedUser.password)
      if (!ok) {
        return handleBadRequest(401, "The last password is incorrect")
      }
    }

    if (email && email !== loggedUser.email) {
      const exists = await User.findOne({ email }).select("_id")
      if (exists) return handleBadRequest(409, "Email is already being used")
    }

    if (username && username !== loggedUser.username) {
      const exists = await User.findOne({ username }).select("_id")
      if (exists) return handleBadRequest(409, "Username is already being used")
    }

    req.loggedUserDoc = loggedUser

    return next()
  } catch (error) {
    return handleBadRequest(500, serverError(error.message).message)
  }
}

module.exports = userValidation
