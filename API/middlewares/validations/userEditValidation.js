const User = require('../../models/User')
const bf = require('better-format')
const deleteImage = require('../../common/deleteImage')

const userValidation = async(req, res, next)=>{
    const { name: username, email, password, private } = req.body

    try{
        // accounts validator
        const loggedUser = await User.findById(req.id)
        if(
            (await User.findOne({ email }) && email != loggedUser.email) ||
            (await User.findOne({ name: username }) && username != loggedUser.name)
        ) return res.status(422).json({ msg: "O email ou o nome já está sendo utilizado." })

        // User Input validations
        if(
            email && (
                !bf.ValidateEmail(email) ||
                email.length <= 0 ||
                email.length > 320
            )
        ) return res.status(400).json({ msg: 'Digite um email válido' })
        if( username && (username.length <= 0 || username.length > 40) )
            return res.status(400).json({ msg: 'O oem deusuario esta muito longo ou não existe' })
        if( password && ( password.length <= 0 || password.length > 50 ) )
            return res.status(400).json({ msg: 'A senha esta muito longa ou não existe' })

        // Delete last pfp if user uploads a new pfp
        if(loggedUser.profile_picture.name != 'Doggo.jpg' && req.file)
            deleteImage(loggedUser.profile_picture.key)

        return next()
    }catch(error){
        // deleta a imagem anterior
        if(req.file) deleteImage(req.file.key)

        return res.status(500).json({ msg: `${error}` })
    }
}

module.exports = userValidation