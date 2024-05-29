const User = require('../../models/User')
const { defaultPfp } = require('../../../constants')
const bcrypt = require('bcrypt')
const { sendVerificationEmail } = require('../../utils/emailHandler')

const {
    success: { created }
} = require('../../../constants')

const register = async(props) => {
    const { name: username, email, password } = props
    const img = defaultPfp

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
    
        return created(`Check your gmail`, user)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = register