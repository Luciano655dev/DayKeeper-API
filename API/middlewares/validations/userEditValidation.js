const User = require('../../models/User')
const bf = require('better-format')
const bcrypt = require('bcrypt')
const deleteFile = require('../../common/deleteFile')

const userValidation = async(req, res, next)=>{
    const {
        name: username,
        email, password,
        bio,
        lastPassword
    } = req.body

    try{
        const handleBadRequest = (req, res, msg)=>{
            if(req.file) deleteFile(req.file.key)
            return res.status(400).json({ msg })
        }

        // accounts validator
        const loggedUser = await User.findById(req.id)
        if(
            (await User.findOne({ email }) && email != loggedUser.email) ||
            (await User.findOne({ name: username }) && username != loggedUser.name)
        ) return handleBadRequest(req, res, "O email ou o nome já está sendo utilizado.")

        // User Input validations
        if(
            email && (
                !bf.ValidateEmail(email) ||
                email.length <= 0 ||
                email.length > 320
            )
        ) return handleBadRequest(req, res, 'Digite um email válido')

        if( bio && (bio.length <= 0 || bio.length > 500) )
            return handleBadRequest(req, res, 'A bio está muito longa ou não existe')

        if( username && (username.length <= 0 || username.length > 40) )
            return handleBadRequest(req, res, 'O nome de esta muito longo ou não existe')

        if(password){
            if(password.length <= 0 || password.length > 50)
                return handleBadRequest(req, res, 'A senha esta muito longa ou não existe')

            const checkPassword = await bcrypt.compare(lastPassword, loggedUser.password)
            if (!checkPassword) handleBadRequest(req, res, "A senha antiga esta incorreta")
        }

        // Delete last pfp if user uploads a new pfp
        if(loggedUser.profile_picture.name != 'Doggo.jpg' && req.file)
            deleteFile(loggedUser.profile_picture.key)

        return next()
    }catch(error){
        // deleta a imagem anterior
        if(req.file) deleteFile(req.file.key)

        return res.status(500).json({ msg: `${error}` })
    }
}

module.exports = userValidation