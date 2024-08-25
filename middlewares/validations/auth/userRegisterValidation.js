const User = require("../../../api/models/User")
const BannedUser = require("../../../api/models/BannedUser")
const { listTimeZones } = require(`timezone-support`)

const {
  auth: { maxEmailLength, maxUsernameLength, maxPasswordLength },
  errors: { serverError },
} = require("../../../constants/index")

const userValidation = async (req, res, next) => {
  const { name: username, email, password, timeZone } = req.body

  try {
    const user = await User.findOne({ $or: [{ name: username }, { email }] })
    if (user)
      return res
        .status(409)
        .json({ message: "This username or email has already been registered" })

    const emailIsBanned = await BannedUser.findOne({ email })
    if (emailIsBanned)
      return res.status(403).json({ message: "This email is banned" })

    // User Input validations
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ message: `Username, email or password is not filled in` })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > maxEmailLength)
      return res.status(400).json({ message: "Enter a valid email" })

    if (!username || username.length > maxUsernameLength)
      return res.status(413).json({ message: `Username is too long` })

    if (!password || password.length > maxPasswordLength)
      return res.status(413).json({ message: `Password is too long` })

    // time zone validation
    if (timeZone && !listTimeZones().includes(timeZone))
      return res.status(400).json({ message: `TimeZone is invalid` })

    return next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = userValidation
