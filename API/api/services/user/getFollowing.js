const User = require('../../models/User')
const { notFound } = require('../../../constants')
const { hideUserData } = require('../../repositories')

const getFollowing = async(props)=>{
    const { name } = props

    try{
      const user = await User.findOne({ name })
      if(!user) return { code: 404, message: notFound("User") }
  
      const usersFollowing = await User.find({ followers: user._id }).select(hideUserData)
  
      return { code: 200, users: usersFollowing }
    } catch (error) {
      throw new Error(error.message)
    }
}

module.exports = getFollowing