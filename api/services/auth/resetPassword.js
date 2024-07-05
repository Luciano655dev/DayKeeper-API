const User = require('../../models/User')
const bcrypt = require('bcrypt')
const {
  errors: { fieldsNotFilledIn, notFound, unauthorized, invalidValue },
  success: { reseted }
} = require('../../../constants/index')

const resetPassword = async (props) => {
  const { verificationCode, email, password } = props

  if(!verificationCode || !password)
    return fieldsNotFilledIn(`all`)

  try {
    const user = await User.findOne({ email })

    if (!user)
      return notFound("User")
    if (user.verification_code !== verificationCode){
      // Delete the old verification code
      user.verification_code = undefined
      user.verification_time = undefined
      await user.save()

      return invalidValue(`Verification code`)
    }
    if(user.verification_time < Date.now())
      return unauthorized(`confirm email`, `time expired`)

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    user.password = passwordHash
    user.verification_code = undefined
    user.verification_time = undefined

    await user.save()

    return reseted(`Password`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = resetPassword