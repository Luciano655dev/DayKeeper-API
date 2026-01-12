const User = require("../../../api/models/User")
const BannedUser = require("../../../api/models/BannedUser")
const { listTimeZones } = require("timezone-support")

const {
  auth: { maxEmailLength, maxUsernameLength, maxPasswordLength },
  errors: { serverError },
  user: { forbiddenUsernames },
} = require("../../../constants/index")

const TIMEZONES = new Set(listTimeZones())

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// lowercase only, no spaces, no special chars (except _ .)
// examples allowed: luciano, luciano_01, luciano.dev
const USERNAME_REGEX = /^[a-z0-9._]+$/

const userRegisterValidation = async (req, res, next) => {
  try {
    let { username, email, password, timeZone } = req.body

    // required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email or password is not filled in",
      })
    }

    // normalize
    username = String(username).trim()
    email = String(email).trim().toLowerCase()

    req.body.username = username
    req.body.email = email

    /* ---------------- EMAIL ---------------- */

    if (!EMAIL_REGEX.test(email) || email.length > maxEmailLength) {
      return res.status(400).json({ message: "Enter a valid email" })
    }

    /* ---------------- USERNAME ---------------- */

    if (username.length > maxUsernameLength) {
      return res.status(413).json({ message: "Username is too long" })
    }

    // no uppercase letters
    if (username !== username.toLowerCase()) {
      return res.status(400).json({
        message: "Username cannot contain uppercase letters",
      })
    }

    // no special characters
    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({
        message:
          "Username can only contain lowercase letters, numbers, dots and underscores",
      })
    }

    // forbidden usernames
    if (
      forbiddenUsernames?.some(
        (forbidden) => forbidden.toLowerCase() === username
      )
    ) {
      return res.status(403).json({
        message: "This username is not allowed",
      })
    }

    /* ---------------- PASSWORD ---------------- */

    if (password.length > maxPasswordLength) {
      return res.status(413).json({ message: "Password is too long" })
    }

    /* ---------------- TIMEZONE ---------------- */

    if (timeZone && !TIMEZONES.has(timeZone)) {
      return res.status(400).json({ message: "TimeZone is invalid" })
    }

    /* ---------------- BANNED EMAIL ---------------- */

    const emailIsBanned = await BannedUser.findOne({ email }).select("_id")
    if (emailIsBanned) {
      return res.status(403).json({ message: "This email is banned" })
    }

    /* ---------------- EXISTING USER ---------------- */

    const existing = await User.findOne({
      $or: [{ username }, { email }],
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

module.exports = userRegisterValidation
