const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  sendVerificationEmail,
  sendPasswordResetEmail
} = require('../common/emailHandler')

// temp
const postImg = (req, res)=>{
  const { originalname: name, size, key, location: url = "" } = req.file

  const img = {
    name,
    size,
    key,
    url
  }

  return res.status(200).json({ img })
}

// register
const register = async(req, res) => {
  const { name: username, email, password } = req.body
  const private = req.body.private == 'true'

  if(!req.file){
    req.file = {
      originalname: 'Doggo.jpg',
      size: 9012,
      key: 'Doggo.jpg',
      location: "https://daykeeper.s3.amazonaws.com/Doggo.jpg"
    }
  }
  
  const {
    originalname,
    size,
    key,
    location: url
  } = req.file

  const img = {
    name: originalname,
    size,
    key,
    url
  }

  try {
    await sendVerificationEmail(username, email, img.url)

    // create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      name: username,
      email,
      private,
      profile_picture: img,
      followers: [],
      follow_requests: ( private ? [] : undefined ),
      blocked_users: [],
      verified_email: false,
      password: passwordHash,
      creation_date: Date.now()
    })

    await user.save()
    res.status(201).json({ msg: "Ative sua conta no seu Email", info: user })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

// verifyEmail
const confirmEmail = async(req, res) => {
  const { token } = req.query
  if(!token) return res.status(422).json({ msg: 'O token não fo passado' })

  try{
    jwt.verify(token, process.env.EMAIL_SECRET, async(err, decoded) => {
      if (err) return res.status(401).send('Token inválido ou expirado.')
      const { email } = decoded
  
      const user = await User.findOneAndUpdate(
        { email },
        { $set: { verified_email: true } },
        { new: true }
      )
      if(!user) return res.status(404).json({ msg: 'Usuario não encontrado' })
      await user.save()

      res.status(200).json({ msg: `Email de ${user.name} confirmado com sucesso!` })
    })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
}

// login
const login = async(req, res)=>{
  const { name: userInput, password } = req.body

  // validations
  if (!userInput || !password)
    return res.status(422).json({ msg: "Todos os campos precisam ser preenchidos." })

  try {
    // check if user exists
    const user = await User.findOne({ $or: [{ name: userInput }, { email: userInput }] })
    if(!user) return res.status(404).json({ msg: "Usuário não encontrado" })

    // check if the Email is verified
    if(!user.verified_email){
      await sendVerificationEmail(user.name, user.email)
      return res.status(422).json({ msg: "Sua conta ainda não foi ativada, acabamos de te mandar um novo email de confirmação!" })
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) return res.status(422).json({ msg: "Senha inválida" })

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name
      },
      process.env.SECRET
    )

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token, user })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
};

// forgetPassword
const forgetPassword = async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user)
      return res.status(404).json({ msg: 'Usuário não encontrado' })

    // Gerar token de redefinição de senha
    const resetToken = jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: '1h' })
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 3600000 // Token válido por 1 hora

    await user.save()

    // Enviar email de redefinição de senha
    await sendPasswordResetEmail(email, resetToken)

    res.status(200).json({ msg: 'Um email de redefinição de senha foi enviado para o seu endereço de email registrado.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: error.message })
  }
}

// resetPassword
const resetPassword = async (req, res) => {
  const { token } = req.query
  const { password } = req.body

  if(!token || !password)
    return res.status(422).json({ msg: "Preencha todos os campos!" })

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET)

    const user = await User.findOne({ email: decoded.email })

    if (!user)
      return res.status(404).json({ msg: 'Usuário não encontrado' })

    // Atualizar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    user.password = passwordHash

    await user.save()

    res.status(200).json({ msg: 'Senha redefinida com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ msg: 'Token inválido ou expirado' })
  }
};

// userData
const userData = async(req, res)=>{
  try {
    // Use o ID do usuário obtido do token para encontrar o usuário no banco de dados
    const user = await User.findById(req.id).select("-password")
    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" })

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

module.exports = {
  register,
  login,
  userData,
  confirmEmail,
  forgetPassword,
  resetPassword,
  postImg
}