const User = require(`../../models/User`)
const {
    success: { created }
} = require('../../../constants/index')

const googleAuth = async(props)=>{
    const {
        req
    } = props

    try {
        console.log(`Deu certo, bem vindo ${req.user.name}`)

        const userExist = await User.findOne({ email: req.user.email })
        console.log(userExist)

        return created(`User ${req.user.name}`)
    }catch(error){
        throw new Error(error.message)
    }
}

module.exports = googleAuth