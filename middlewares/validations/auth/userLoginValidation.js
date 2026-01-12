const User = require("../../../api/models/User")
const bcrypt = require("bcryptjs")
const resendCode = require("../../../api/services/auth/resendVerificationCode")

const {
  errors: { serverError },
  auth: { maxEmailLength, maxUsernameLength, maxPasswordLength },
  user: { forbiddenUsernames },
} = require("../../../constants/index")

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-z0-9._]+$/

const userLoginValidation = async (req, res, next) => {
  try {
    const { email: userInputRaw, password } = req.body

    if (!userInputRaw || !password) {
      return res
        .status(400)
        .json({ message: "Email/username and password are required" })
    }

    if (typeof userInputRaw !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input" })
    }

    const userInput = userInputRaw.trim()
    const inputLower = userInput.toLowerCase()

    // basic length checks (safe, doesn’t leak anything)
    if (password.length > maxPasswordLength) {
      return res.status(413).json({ message: "Password is too long" })
    }

    // decide if it's email or username
    const looksLikeEmail = EMAIL_REGEX.test(inputLower)

    if (looksLikeEmail) {
      // email checks
      if (inputLower.length > maxEmailLength) {
        return res.status(413).json({ message: "Email is too long" })
      }
    } else {
      // username checks (same as register)
      if (userInput.length > maxUsernameLength) {
        return res.status(413).json({ message: "Username is too long" })
      }

      // no uppercase
      if (userInput !== inputLower) {
        return res.status(400).json({
          message: "Username cannot contain uppercase letters",
        })
      }

      // only allowed chars
      if (!USERNAME_REGEX.test(userInput)) {
        return res.status(400).json({
          message:
            "Username can only contain lowercase letters, numbers, dots and underscores",
        })
      }

      // forbidden usernames (don’t allow logging in as these)
      if (
        forbiddenUsernames?.some(
          (forbidden) => forbidden.toLowerCase() === userInput
        )
      ) {
        return res.status(401).json({ message: "Incorrect email or password" })
      }
    }

    // find by email (lowercased) OR username (exact)
    const user = await User.findOne({
      $or: looksLikeEmail ? [{ email: inputLower }] : [{ name: userInput }],
    })

    // Avoid user enumeration
    if (!user || !user.password) {
      return res.status(401).json({ message: "Incorrect email or password" })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ message: "Incorrect email or password" })
    }

    // correct password; handle unverified
    if (!user.verified_email) {
      resendCode({ email: user.email }).catch(() => null)

      return res.status(403).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Email not verified. A new confirmation code has been sent.",
      })
    }

    // normalize downstream login to always use email
    req.body.email = user.email
    return next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = userLoginValidation
