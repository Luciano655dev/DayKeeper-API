const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { fieldsNotFilledIn, notFound } = require('../../../constants')

const resetPassword = async (props) => {
  const { token, password } = props

  if(!token || !password)
    return { code: 400, message: fieldsNotFilledIn }

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET)
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.findOneAndUpdate({ email: decoded.email }, {
      $set: {
        password: passwordHash
      }
    }, { new: true })

    if (!user)
      return { code: 404, message: notFound("User") }

    await user.save()
    return { code: 200, message: "Password reset successfully" }
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = resetPassword