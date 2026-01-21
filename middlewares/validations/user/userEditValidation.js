const User = require("../../../api/models/User")
const bcrypt = require("bcryptjs")
const deleteFile = require("../../../api/utils/deleteFile")

const {
  auth: {
    maxEmailLength,
    maxBioLength,
    maxUsernameLength,
    maxPasswordLength,
    maxDisplayNameLength,
    maxTimeZoneLength, // add this in constants if you want; fallback below if not present
  },
  errors: { serverError },
} = require("../../../constants/index")

function isValidIanaTimeZone(tz) {
  if (typeof tz !== "string") return false
  const s = tz.trim()
  if (!s) return false

  // Fast reject for common non-IANA inputs like "EST", "GMT-5", "+02:00"
  // IANA zones usually contain "/" (e.g. "America/New_York")
  // But we won't rely only on that; Intl check is the real validation.
  try {
    Intl.DateTimeFormat("en-US", { timeZone: s }).format()
    return true
  } catch {
    return false
  }
}

const userValidation = async (req, res, next) => {
  let { username, displayName, email, password, bio, lastPassword, timeZone } =
    req.body

  const handleBadRequest = (status, message) => {
    if (req.file) deleteFile({ key: req.file.key })
    return res.status(status).json({ message })
  }

  try {
    // normalize
    username = typeof username === "string" ? username.trim() : undefined
    displayName =
      typeof displayName === "string" ? displayName.trim() : undefined
    if (displayName === "") displayName = undefined

    email = typeof email === "string" ? email.trim().toLowerCase() : undefined
    bio = typeof bio === "string" ? bio : undefined

    timeZone = typeof timeZone === "string" ? timeZone.trim() : undefined
    if (timeZone === "") timeZone = undefined

    // load fresh user with password (don’t trust req.user snapshot)
    const loggedUser = await User.findById(req.user._id).select(
      "email username displayName password profile_picture private timeZone",
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

    if (displayName && displayName.length > maxDisplayNameLength) {
      return handleBadRequest(413, "Display name is too long")
    }

    // timeZone validation (IANA, date-fns-tz compatible)
    const tzMax = typeof maxTimeZoneLength === "number" ? maxTimeZoneLength : 64
    if (timeZone) {
      if (timeZone.length > tzMax) {
        return handleBadRequest(413, "Time zone is too long")
      }
      if (!isValidIanaTimeZone(timeZone)) {
        return handleBadRequest(400, "Enter a valid time zone")
      }
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

    if (timeZone !== undefined) req.body.timeZone = timeZone

    req.loggedUserDoc = loggedUser
    return next()
  } catch (error) {
    return handleBadRequest(500, serverError(error.message).message)
  }
}

module.exports = userValidation
