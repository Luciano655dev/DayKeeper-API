const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  sendVerificationEmail,
  sendPasswordResetEmail
} = require('../common/emailHandler')

// register
const register = async(req, res) => {
  const { name: username, email, password } = req.body

  const img = {
    name: 'Doggo.jpg',
    key: 'Doggo.jpg',
    url: "https://daykeeper.s3.amazonaws.com/Doggo.jpg"
  }

  try {
    // create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      name: username,
      email,
      bio: '',
      profile_picture: img,
      private: false,
      roles: [ 'user' ],
      followers: [],
      blocked_users: [],
      verified_email: false,
      password: passwordHash,
      creation_date: Date.now()
    })
    await user.save()

    await sendVerificationEmail(username, email, img.url)

    return res.status(201).json({ message: "Ative sua conta no seu Email", info: user })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// verifyEmail
const confirmEmail = async(req, res) => {
  const { token } = req.query

  if(!token)
    return res.status(422).json({ msg: "The token needs to be filled in" })

  try{
    jwt.verify(token, process.env.EMAIL_SECRET, async(err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid or expired Token" })
      const { email } = decoded
  
      const user = await User.findOneAndUpdate(
        { email },
        { $set: { verified_email: true } },
        { new: true }
      )
      if(!user) return res.status(404).json({ message: "User not found" })
      await user.save()

      return res.status(200).json({ msg: `${user.name}'s email confirmed successfully` })
    })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// login
const login = async(req, res)=>{
  const { name: userInput } = req.body

  try {
    // check if user exists
    const user = await User.findOne({ $or: [{ name: userInput }, { email: userInput }] })

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name
      },
      process.env.SECRET
    )

    return res.status(200).json({ message: "Authentication completed successfully", token, user })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// forgetPassword
const forgetPassword = async (req, res) => {
  const { email } = req.body

  try {
    const resetToken = jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: '1h' })
    const user = await User.findOneAndUpdate({ email }, {
      $set: {
        resetPassword: resetToken,
        resetPasswordExpires: Date.now() + 3600000
      }
    }, { new: true })

    if (!user)
      return res.status(404).json({ message: "User not found" })

    await user.save()

    // Enviar email de redefinição de senha
    await sendPasswordResetEmail(email, resetToken)

    return res.status(200).json({ message: "A password reset email has been sent to your registered email address" })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// resetPassword
const resetPassword = async (req, res) => {
  const { token } = req.query
  const { password } = req.body

  if(!token || !password)
    return res.status(400).json({ message: "Fill in all fields" })

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
      return res.status(404).json({ message: "User not found" })

    await user.save()
    return res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    return res.status(400).json({ msg: "Invalid or expired token. If this error persists, contact an admin" })
  }
}

// userData
const userData = async(req, res)=>{
  try {
    // Use o ID do usuário obtido do token para encontrar o usuário no banco de dados
    const user = await User.findById(req.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

module.exports = {
  register,
  login,
  userData,
  confirmEmail,
  forgetPassword,
  resetPassword
}