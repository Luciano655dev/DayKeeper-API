const User = require('../../../api/models/User')
const bcrypt = require('bcrypt')
const deleteFile = require('../../../api/utils/deleteFile')
const { serverError, inputTooLong, user: { defaultPfp } } = require('../../../constants/index')

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
        if(
            await User.findOne({ name: username }) &&
            username != loggedUser.name
        ) return handleBadRequest(409, "Username is already being used")

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
            return handleBadRequest(413, inputTooLong('Bio'))

        if( username && username.length > maxUsernameLength )
            return handleBadRequest(413, inputTooLong('Username'))

        if(password){
            if(password.length > maxPasswordLength)
                return handleBadRequest(413, inputTooLong('Password'))

            const checkPassword = await bcrypt.compare(lastPassword, loggedUser.password)
            if (!checkPassword) return handleBadRequest(401, "A senha antiga esta incorreta")
        }

        /* Delete last profiel picture if user uploads a new one */
        if(req.file && loggedUser.profile_picture.name != defaultPfp.name)
            deleteFile(loggedUser.profile_picture.key)

        return next()
    }catch(error){
        return handleBadRequest(500, serverError(error.message))
    }
}

module.exports = userValidation