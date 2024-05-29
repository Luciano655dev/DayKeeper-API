const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { mail } = require("../../../config")
const {
    errors: { notFound, unauthorized, fieldNotFilledIn },
    success: { custom }
} = require("../../../constants")

const confirmEmail = async(props)=>{
    const { token } = props

    if(!token)
        return fieldNotFilledIn('token')

    try{
        return jwt.verify(token, mail.secret, async(err, decoded) => {
            if (err)
                return unauthorized(`Invalid or expired token`)
            const { email } = decoded
        
            const user = await User.findOneAndUpdate(
              { email },
              { $set: { verified_email: true } },
              { new: true }
            )
            if(!user)
                return notFound('User')
            await user.save()
      
            return custom(`${user.name}'s email confirmed successfully` )
        })
    }catch(error){
        throw new Error(error.mesage)
    }
}

module.exports = confirmEmail