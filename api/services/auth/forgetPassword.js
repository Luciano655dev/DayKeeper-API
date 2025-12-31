const User = require("../../models/User")
const crypto = require("crypto")
const { sendPasswordResetEmail } = require("../../utils/emailHandler")

const {
  auth: { resetPasswordExpiresTime },
  success: { custom },
} = require("../../../constants/index")

function make6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex")
}

const forgetPassword = async (props) => {
  let { email } = props
  email = (email || "").trim().toLowerCase()

  // Always return the same message (avoid enumeration)
  const genericMsg =
    "If an account with that email exists, a password reset email has been sent."

  try {
    const user = await User.findOne({ email })
    if (!user || !user.verified_email) {
      // Do not reveal if user exists
      console.log(email)
      return custom(genericMsg)
    }

    const code = make6DigitCode()
    const codeHash = hashCode(code)
    const expiresAt = new Date(Date.now() + resetPasswordExpiresTime)

    // Store hash + expiry (atomic)
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          reset_code_hash: codeHash,
          reset_expires_at: expiresAt,
        },
      }
    )

    // Best-effort email (don’t fail the request if provider is down)
    sendPasswordResetEmail(email, code).catch(() => null)
    console.log(`Reset Password Code: ${code}`)

    return custom(genericMsg)
  } catch (error) {
    console.log("error")
    throw new Error(error.message)
  }
}

module.exports = forgetPassword
