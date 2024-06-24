const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { secret } = require('../../../config')
const {
  success: { custom }
} = require('../../../constants/index')

const login = async(props)=>{
  const { name: userInput } = props

  try{
    const user = await User.findOne({ $or: [{ name: userInput }, { email: userInput }] })

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name
      },
      secret
    )

    return custom("Authentication completed successfully", { token, user })
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = login