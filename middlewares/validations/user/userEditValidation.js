const User = require("../../../api/models/User")
const bcrypt = require("bcryptjs")
const deleteFile = require("../../../api/utils/deleteFile")
const {
  auth: { maxEmailLength, maxBioLength, maxUsernameLength, maxPasswordLength },
  user: { defaultPfp },
  errors: { serverError },
} = require("../../../constants/index")

const userValidation = async (req, res, next) => {
  const { name: username, email, password, bio, lastPassword } = req.body

  const handleBadRequest = (errCode, message) => {
    if (req.file) deleteFile({ key: req.file.key })
    return res.status(errCode).json({ message })
  }

  try {
    /* Availability validation */
    const loggedUser = req.user
    if ((await User.findOne({ email })) && email != loggedUser.email)
      return handleBadRequest(409, "Email is already being used")
    if ((await User.findOne({ name: username })) && username != loggedUser.name)
      return handleBadRequest(409, "Username is already being used")

    /* Input validations */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (
      email &&
      (!emailRegex.test(email) ||
        email.length <= 0 ||
        email.length > maxEmailLength)
    )
      return handleBadRequest(400, "Enter a valid email")

    if (bio && bio.length > maxBioLength)
      return handleBadRequest(413, "Bio is too long")

    if (username && username.length > maxUsernameLength)
      return handleBadRequest(413, "Username is too long")

    if (password) {
      if (password.length > maxPasswordLength)
        return handleBadRequest(413, "Password is too long")

      const checkPassword = await bcrypt.compare(
        lastPassword,
        loggedUser.password
      )
      if (!checkPassword)
        return handleBadRequest(401, "The last password is incorrect")
    }

    /* Delete last profiel picture if user uploads a new one */
    if (req.file && loggedUser.profile_picture.name != defaultPfp.name)
      deleteFile(loggedUser.profile_picture.key)

    return next()
  } catch (error) {
    return handleBadRequest(500, serverError(error.message).message)
  }
}

module.exports = userValidation
