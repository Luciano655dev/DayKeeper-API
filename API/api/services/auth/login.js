const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const { secret } = require('../../../config')

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

    return { token, user }
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = login