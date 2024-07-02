const User = require('../../models/User')
const { sendPasswordResetEmail } = require('../../utils/emailHandler')
const {
  auth: { resetPasswordExpiresTime },
  errors: { notFound },
  success: { custom }
} = require('../../../constants/index')

const forgetPassword = async (props) => {
  const { email } = props

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
  const verificationCodeTime = Date.now() + resetPasswordExpiresTime

  try {
    const user = await User.findOneAndUpdate({ email }, {
      $set: {
        verification_code: verificationCode,
        verification_time: verificationCodeTime
      }
    }, { new: true })

    if (!user)
      return notFound('User')

    await user.save()

    // Enviar email de redefinição de senha
    await sendPasswordResetEmail(email, verificationCode)

    return custom("A password reset email has been sent to your registered email address" )
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = forgetPassword