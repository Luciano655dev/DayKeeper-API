const deleteImage = require('../../common/deleteImage')
const User = require('../../models/User')
const bf = require('better-format')

const userValidation = async(req, res, next)=>{
  const { name: username, email, password, private } = req.body

  try{
    const user = await User.findOne({ $or: [{ name: username }, { email }] })

    // User Input validations
    if (!username || !email || !password || !private)
      return handleBadRequest(req, res, 'Preencha todos os campos')

    if (!bf.ValidateEmail(email) || email.length <= 0 || email.length > 320)
      return handleBadRequest(req, res, 'Digite um email válido')

    if (username.length <= 0 || username.length > 40)
      return handleBadRequest(req, res, 'O nome de usuário está muito longo ou não existe')

    if (password.length <= 0 || password.length > 50)
      return handleBadRequest(req, res, 'A senha está muito longa ou não existe');

    function handleBadRequest(req, res, msg) {
      console.log(msg)
      if(req.file) deleteImage(req.file.key)
        return res.status(400).json({ msg })
    }
  
    if(user)
      return res.status(400).json({ msg: 'Este nome ou email já foi cadastrado' })
  
    return next()
  }catch(error){
    // deleta a imagem enviada anteriormente
    if(req.file) deleteImage(req.file.key)

    return res.status(500).json({ msg: `${error}` })
  }
}

module.exports = userValidation