const User = require("../../../api/models/User")
const { sendVerificationEmail } = require("../../../api/utils/emailHandler")
const bcrypt = require("bcrypt")

const {
  errors: { serverError },
} = require(`../../../constants/index`)
const {
  auth: { registerCodeExpiresTime },
} = require("../../../constants/index")

const userValidation = async (req, res, next) => {
  // userInput is email or username
  const { name: userInput, password } = req.body

  try {
    /* Input validations */
    if (!userInput || !password)
      return res
        .status(400)
        .json({ message: `name or password is not filled in` })

    /* User validation */
    const user = await User.findOne({
      $or: [{ name: userInput }, { email: userInput }],
    })
    if (!user) return res.status(404).json({ message: `User not found` })

    /* Email validation */
    if (!user.verified_email) {
      // new 6 digit code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString()
      const verificationCodeTime = Date.now() + registerCodeExpiresTime

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            verification_code: verificationCode,
            verification_time: verificationCodeTime,
          },
        }
      )

      await sendVerificationEmail(
        user.name,
        user.email,
        user.profile_picture.url,
        verificationCode
      )

      console.log(verificationCode)
      return res.status(403).json({
        message:
          "Your account is not active yet, we have just sent you a new confirmation email",
      })
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword)
      return res.status(401).json({ message: "Invalid Password" })

    return next()
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = userValidation
