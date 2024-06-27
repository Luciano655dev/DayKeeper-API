const User = require('../../../api/models/User')
const { sendVerificationEmail } = require('../../../api/utils/emailHandler')
const { serverError, fieldsNotFilledIn, notFound } = require('../../../constants/index')
const bcrypt = require('bcrypt')

const userValidation = async(req, res, next)=>{
    // userInput is email or username
    const { name: userInput, password } = req.body

    try{
        /* Input validations */
        if (!userInput || !password)
            return res.status(400).json({ message: fieldsNotFilledIn })

        /* User validation */
        const user = await User.findOne({ $or: [{ name: userInput }, { email: userInput }] })
        if(!user)
            return res.status(404).json({ message: notFound('User') })

        /* Email validation */
        if(!user.verified_email) {
            await sendVerificationEmail(user.name, user.email)
            return res.status(403).json({ message: "Your account is not active yet, we have just sent you a new confirmation email" })
        }

        // check if password match
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword)
            return res.status(401).json({ message: "Invalid Password" })

        return next()
    }catch(error){
        return res.status(500).json({ message: serverError(error.message) })
    }
}

module.exports = userValidation