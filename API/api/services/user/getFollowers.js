const User = require('../../models/User')
const { notFound } = require('../../../constants')
const { hideUserData } = require('../../repositories')

const getFollowers = async(props)=>{
    const { name } = props

    try{
      let user = await User.findOne({ name })
        .populate({ path: 'followers', select: hideUserData })
  
      if(!user) user = await User.findOne({ _id: name })
        .populate({ path: 'followers', select: hideUserData })
  
      if(!user) return { code: 404, message: notFound("User") }
  
      return { code: 200, users: user.followers }
    } catch (error) {
      throw new Error(error.message)
    }
}

module.exports = getFollowers