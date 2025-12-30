const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const { sendVerificationEmail } = require("../../utils/emailHandler")

const {
  user: { defaultPfp, defaultTimeZone },
  auth: { registerCodeExpiresTime },
  success: { created },
} = require("../../../constants/index")

const register = async (props) => {
  const { name: username, email, password, timeZone } = props

  if (!password) {
    throw new Error("Password is required for local registration")
  }

  const existing = await User.findOne({ email })
  if (existing) throw new Error("Email already in use")

  const img = defaultPfp

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString()
  const verificationCodeTime = Date.now() + registerCodeExpiresTime

  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = new User({
    name: username,
    email,
    bio: "",
    timeZone: timeZone || defaultTimeZone,
    profile_picture: img,
    private: false,
    roles: ["user"],
    blocked_users: [],
    verified_email: false,
    password: passwordHash,
    created_at: Date.now(),
    google_id: null,
    verification_code: verificationCode,
    verification_time: verificationCodeTime,
  })

  await user.save()
  await sendVerificationEmail(username, email, img.url, verificationCode)

  return created(`${username}`, user)
}

module.exports = register
