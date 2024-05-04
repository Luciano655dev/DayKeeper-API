const User = require('../../models/User')
const { notFound } = require('../../../constants')

const getUserData = async(props)=>{
  const { id } = props

  try {
    const user = await User.findById(id).select("-password")
    if (!user)
      return { code: 404, message: notFound('User'), user: undefined }

    return { code: 200, message: undefined, user }
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getUserData