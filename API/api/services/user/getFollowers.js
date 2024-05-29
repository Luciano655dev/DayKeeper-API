const User = require('../../models/User')
const { hideUserData } = require('../../repositories')

const {
  errors: { notFound },
  success: { fetched }
} = require('../../../constants')

const getFollowers = async(props)=>{
  const { name } = props

  try{
    let user = await User.findOne({ name })
      .populate({ path: 'followers', select: hideUserData })

    if(!user) user = await User.findOne({ _id: name })
      .populate({ path: 'followers', select: hideUserData })

    if(!user)
      return notFound("User")

    return fetched(`followers`, { users: user.followers })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getFollowers