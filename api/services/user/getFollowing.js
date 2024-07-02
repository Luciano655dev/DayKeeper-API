const User = require('../../models/User')
const { hideUserData } = require('../../repositories')

const {
  errors: { notFound },
  success: { fetched }
} = require('../../../constants/index')

const getFollowing = async(props)=>{
  const { name } = props

  try{
    const user = await User.findOne({ name })
    if(!user)
      return notFound("User")

    const usersFollowing = await User.find({ followers: user._id }).select(hideUserData)

    return fetched(`following users`, { users: usersFollowing })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getFollowing