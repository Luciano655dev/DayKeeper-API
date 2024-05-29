const User = require('../../models/User')
const {
  errors: { notFound },
  success: { fetched }
} = require('../../../constants')

const getUserData = async(props)=>{
  const { id } = props

  try {
    const user = await User.findById(id).select("-password")
    if (!user)
      return notFound('User')

    return fetched(`user`, user)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getUserData