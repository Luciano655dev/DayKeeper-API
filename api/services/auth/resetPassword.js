const User = require("../../models/User")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")

const {
  errors: { fieldsNotFilledIn, unauthorized, invalidValue },
  success: { updated },
} = require("../../../constants/index")

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex")
}

const resetPassword = async (props) => {
  let { verificationCode, email, password } = props

  if (!verificationCode || !email || !password) return fieldsNotFilledIn("all")

  email = email.trim().toLowerCase()
  verificationCode = verificationCode.toString().trim()

  const codeHash = hashCode(verificationCode)

  try {
    const user = await User.findOne({ email })
    // Avoid enumeration: don’t say "User not found" here
    if (!user) {
      console.log("not found")
      return invalidValue("Verification code")
    }

    if (!user.reset_code_hash || !user.reset_expires_at) {
      console.log(user.reset_code_hash, user.reset_expires_at)
      return invalidValue("Verification code")
    }

    if (user.reset_expires_at.getTime() < Date.now()) {
      // Clear expired token
      await User.updateOne(
        { _id: user._id },
        { $unset: { reset_code_hash: 1, reset_expires_at: 1 } }
      )
      return unauthorized("reset password", "time expired")
    }

    if (user.reset_code_hash !== codeHash) {
      await User.updateOne(
        { _id: user._id },
        { $unset: { reset_code_hash: 1, reset_expires_at: 1 } }
      )
      return invalidValue("Verification code")
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Atomic update: set password + clear reset fields
    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: passwordHash },
        $unset: { reset_code_hash: 1, reset_expires_at: 1 },
      }
    )

    return updated("Password")
  } catch (error) {
    console.log("error...")
    throw new Error(error.message)
  }
}

module.exports = resetPassword
