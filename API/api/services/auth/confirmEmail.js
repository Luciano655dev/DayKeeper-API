const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { mail } = require("../../../config")
const { notFound } = require("../../../constants")

const confirmEmail = async(props)=>{
    const { token } = props

    if(!token)
        return { code: 400, message: "The token needs to be filled in" }

    try{
        return jwt.verify(token, mail.secret, async(err, decoded) => {
            if (err) return { code: 400, message: "Invalid or expired token" }
            const { email } = decoded
        
            const user = await User.findOneAndUpdate(
              { email },
              { $set: { verified_email: true } },
              { new: true }
            )
            if(!user)
                return { code: 404, message: notFound('User') }
            await user.save()
      
            return { code: 200, message: `${user.name}'s email confirmed successfully` }
        })
    }catch(error){
        throw new Error(error.mesage)
    }
}

module.exports = confirmEmail