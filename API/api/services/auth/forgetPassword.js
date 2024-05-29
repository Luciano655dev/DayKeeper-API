const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { sendPasswordResetEmail } = require('../../utils/emailHandler')
const {
  auth: { resetTokenExpiresTime, resetPasswordExpiresTime },
  errors: { notFound },
  success: { custom }
} = require('../../../constants')

const forgetPassword = async (props) => {
  const { email } = props

  try {
    const resetToken = jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: resetTokenExpiresTime })
    const user = await User.findOneAndUpdate({ email }, {
      $set: {
        resetPassword: resetToken,
        resetPasswordExpires: Date.now() + resetPasswordExpiresTime
      }
    }, { new: true })

    if (!user)
      return notFound('User')

    await user.save()

    // Enviar email de redefinição de senha
    await sendPasswordResetEmail(email, resetToken)

    return custom("A password reset email has been sent to your registered email address" )
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = forgetPassword