const User = require('../../models/User')
const bf = require('better-format')

const userValidation = async(req, res, next)=>{
  const { name: username, email, password } = req.body

  try{
    const user = await User.findOne({ $or: [{ name: username }, { email }] })

    // User Input validations
    if (!username || !email || !password)
      return res.status(400).json({ msg: 'Preencha todos os campos.' })

    if (!bf.ValidateEmail(email) || email.length <= 0 || email.length > 320)
      return res.status(400).json({ msg: 'Digite um email válido' })

    if (username.length <= 0 || username.length > 40)
      return res.status(400).json({ msg: 'O nome de usuário está muito longo ou não existe' })

    if (password.length <= 0 || password.length > 50)
      return res.status(400).json({ msg: 'A senha está muito longa ou não existe' })
  
    if(user)
      return res.status(400).json({ msg: 'Este nome ou email já foi cadastrado' })
  
    return next()
  }catch(error){
    return res.status(500).json({ error })
  }
}

module.exports = userValidation