const User = require('../../../api/models/User')
const BannedUser = require('../../../api/models/BannedUser')
const { serverError, inputTooLong, fieldsNotFilledIn, auth } = require('../../../constants/index')

const userValidation = async(req, res, next)=>{
  const { name: username, email, password } = req.body
  const {
    maxEmailLength,
    maxUsernameLength,
    maxPasswordLength
  } = auth

  try{
    const user = await User.findOne({ $or: [{ name: username }, { email }] })
    if(user)
      return res.status(409).json({ message: "This username or email has already been registered" })

    const emailIsBanned = await BannedUser.findOne({ email })
    if(emailIsBanned)
      return res.status(403).json({ message: "Este email foi banido" })

    // User Input validations
    if (!username || !email || !password)
      return res.status(400).json({ message: fieldsNotFilledIn })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > maxEmailLength)
      return res.status(400).json({ message: "Enter a valid email" })

    if (!username || username.length > maxUsernameLength)
      return res.status(413).json({ message: inputTooLong('Username') })

    if (!password || password.length > maxPasswordLength)
      return res.status(413).json({ message: inputTooLong('Password') })
  
    return next()
  }catch(error){
    return res.status(500).json({ message: serverError(error.message) })
  }
}

module.exports = userValidation