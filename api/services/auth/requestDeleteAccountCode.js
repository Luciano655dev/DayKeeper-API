const crypto = require("crypto")
const User = require("../../models/User")
const { sendAccountDeletionCode } = require("../../utils/emailHandler")
const {
  errors: { unauthorized, notFound },
  success: { custom },
  auth: { resetPasswordExpiresTime },
} = require("../../../constants/index")

function make6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex")
}

const requestDeleteAccountCode = async (props) => {
  const { loggedUser } = props

  if (!loggedUser?._id) return unauthorized("request delete code")

  const user = await User.findById(loggedUser._id)
  if (!user) return notFound("User")

  if (!user.email) return unauthorized("request delete code", "email missing")

  const code = make6DigitCode()
  const codeHash = hashCode(code)
  const expiresAt = new Date(Date.now() + resetPasswordExpiresTime)

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        delete_code_hash: codeHash,
        delete_expires_at: expiresAt,
      },
    }
  )

  sendAccountDeletionCode(user.email, code).catch(() => null)

  return custom(`Delete account code sent to ${user.email}`)
}

module.exports = requestDeleteAccountCode
