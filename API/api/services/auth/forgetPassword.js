const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { sendPasswordResetEmail } = require('../../utils/emailHandler')
const { notFound, auth } = require('../../../constants')

const forgetPassword = async (props) => {
  const { email } = props
  const {
    resetTokenExpiresTime,
    resetPasswordExpiresTime
  } = auth

  try {
    const resetToken = jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: resetTokenExpiresTime })
    const user = await User.findOneAndUpdate({ email }, {
      $set: {
        resetPassword: resetToken,
        resetPasswordExpires: Date.now() + resetPasswordExpiresTime
      }
    }, { new: true })

    if (!user)
      return { code: 404, message: notFound('User') }

    await user.save()

    // Enviar email de redefinição de senha
    await sendPasswordResetEmail(email, resetToken)

    return { code: 200, message: "A password reset email has been sent to your registered email address" }
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = forgetPassword