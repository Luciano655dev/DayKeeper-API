const User = require("../../models/User")
const bcrypt = require("bcrypt")
const { sendVerificationEmail } = require("../../utils/emailHandler")

const {
  user: { defaultPfp, defaultTimeZone },
  auth: { registerCodeExpiresTime },
  success: { created },
} = require("../../../constants/index")

const register = async (props) => {
  const {
    name: username,
    email,
    password,
    timeZone,
    profile_picture,
    google_id,
  } = props

  const img = profile_picture
    ? {
        url: profile_picture,
        name: `${username}'s_profile_picture_from_google`,
        key: ``,
      }
    : defaultPfp

  // new 6 digit code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString()
  const verificationCodeTime = Date.now() + registerCodeExpiresTime

  try {
    // create password
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
      google_id,
      verification_code: verificationCode,
      verification_time: verificationCodeTime,
    })
    await user.save()

    await sendVerificationEmail(username, email, img.url, verificationCode)

    return created(`${username}`, user)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = register
