const User = require("../../../api/models/User")
const BannedUser = require("../../../api/models/BannedUser")
const { listTimeZones } = require("timezone-support")

const {
  auth: { maxEmailLength, maxUsernameLength, maxPasswordLength },
  errors: { serverError },
} = require("../../../constants/index")

const TIMEZONES = new Set(listTimeZones())

const userValidation = async (req, res, next) => {
  try {
    let { name: username, email, password, timeZone } = req.body

    // required fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email or password is not filled in" })
    }

    // normalize (match register.js)
    username = String(username).trim()
    email = String(email).trim().toLowerCase()

    req.body.name = username
    req.body.email = email

    // input validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > maxEmailLength) {
      return res.status(400).json({ message: "Enter a valid email" })
    }

    if (username.length > maxUsernameLength) {
      return res.status(413).json({ message: "Username is too long" })
    }

    if (password.length > maxPasswordLength) {
      return res.status(413).json({ message: "Password is too long" })
    }

    if (timeZone && !TIMEZONES.has(timeZone)) {
      return res.status(400).json({ message: "TimeZone is invalid" })
    }

    // banned email check (use normalized email)
    const emailIsBanned = await BannedUser.findOne({ email }).select("_id")
    if (emailIsBanned) {
      return res.status(403).json({ message: "This email is banned" })
    }

    const existing = await User.findOne({
      $or: [{ name: username }, { email }],
    }).select("_id")
    if (existing) {
      return res.status(409).json({
        message: "This username or email has already been registered",
      })
    }

    return next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = userValidation
