const User = require("../../../api/models/User")
const bcrypt = require("bcryptjs")
const resendCode = require("../../../api/services/auth/resendVerificationCode")

const {
  errors: { serverError },
} = require("../../../constants/index")

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

    // find by email (lowercased) OR by name (exact)
    const user = await User.findOne({
      $or: [{ email: inputLower }, { name: userInput }],
    })

    // Avoid user enumeration (don’t reveal user not found)
    if (!user || !user.password) {
      return res.status(401).json({ message: "Incorrect email or password" })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ message: "Incorrect email or password" })
    }

    // password is correct, now we can resend if unverified
    if (!user.verified_email) {
      resendCode({ email: user.email }).catch(() => null)

      return res.status(403).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Email not verified. A new confirmation code has been sent.",
      })
    }

    req.body.email = user.email
    return next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = userLoginValidation
