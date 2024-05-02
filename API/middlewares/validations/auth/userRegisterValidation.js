const User = require('../../../models/User')
const BannedUser = require('../../../models/BannedUser')

const userValidation = async(req, res, next)=>{
  const { name: username, email, password } = req.body
  const maxEmailLength = 320
  const maxUsernameLength = 40
  const maxPasswordLength = 50

  try{
    const user = await User.findOne({ $or: [{ name: username }, { email }] })
    if(user)
      return res.status(409).json({ message: "This username or email has already been registered" })

    const emailIsBanned = await BannedUser.findOne({ email })
    if(emailIsBanned)
      return res.status(403).json({ message: "Este email foi banido" })

    // User Input validations
    if (!username || !email || !password)
      return res.status(400).json({ message: "Fill in all fields" })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > maxEmailLength)
      return res.status(400).json({ message: "Enter a valid email" })

    if (!username || username.length > maxUsernameLength)
      return res.status(413).json({ message: "The username is too long" })

    if (!password || password.length > maxPasswordLength)
      return res.status(413).json({ message: "The password is too long" })
  
    return next()
  }catch(error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

module.exports = userValidation