const User = require('../../../models/User')
const bcrypt = require('bcrypt')
const deleteFile = require('../../../common/deleteFile')

const userValidation = async(req, res, next)=>{
    const {
        name: username,
        email, password,
        bio,
        lastPassword
    } = req.body
    const maxEmailLength = 320
    const maxBioLength = 500
    const maxUsernameLength = 40
    const maxPasswordLength = 50

    const handleBadRequest = (errCode, message)=>{
        if(req.file) deleteFile(req.file.key)
        return res.status(errCode).json({ message })
    }

    try{
        /* Availability validation */
        const loggedUser = await User.findById(req.id)
        if(await User.findOne({ email }) && email != loggedUser.email)
            return handleBadRequest(409, "Email is already being used")
        if((await User.findOne({ name: username }) || await User.findById(req.id)) && username != loggedUser.name)
            return handleBadRequest(409, "Username is already being used")

        /* Input validations */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(
            email && (
                !emailRegex.test(email) ||
                email.length <= 0 ||
                email.length > maxEmailLength
            )
        ) return handleBadRequest(400, "Enter a valid email")

        if( bio && bio.length > maxBioLength )
            return handleBadRequest(413, "The bio is too long")

        if( username && username.length > maxUsernameLength )
            return handleBadRequest(413, "The username is too long")

        if(password){
            if(password.length > maxPasswordLength)
                return handleBadRequest(413, "The password is too long")

            const checkPassword = await bcrypt.compare(lastPassword, loggedUser.password)
            if (!checkPassword) return handleBadRequest(401, "A senha antiga esta incorreta")
        }

        /* Delete last profiel picture if user uploads a new one */
        if(loggedUser.profile_picture.name != 'Doggo.jpg' && req.file)
            deleteFile(loggedUser.profile_picture.key)

        return next()
    }catch(error){
        return handleBadRequest(500,
            `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
        )
    }
}

module.exports = userValidation