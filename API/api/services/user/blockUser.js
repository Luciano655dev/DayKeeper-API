const User = require("../../models/User")
const { notFound } = require('../../../constants')

const blockUser = async(props)=>{
    const { name, loggedUserId } = props
  
    try{
      const blockedUser = await User.findOne({ name })
      const mainUser = await User.findById(loggedUserId)
  
      /* Validations */
      if(!mainUser || !blockedUser)
        return { code: 404, message: notFound("User") }
      if(blockUser.name == mainUser.name)
        return { code: 409, message: "You can not block yourself" }
  
      /* Unblock */
      if(mainUser.blocked_users.includes(blockedUser._id)){
        await User.updateOne({ name: mainUser.name }, { $pull: { blocked_users: blockedUser._id } })
        return { code: 200, message: `${blockedUser.name} successfully unblocked` }
      }
  
      /* Block */
      await User.updateOne({ name: mainUser.name }, { $push: { blocked_users: blockedUser._id } })
      return { code: 200, message: `${blockedUser.name} successfully blocked` }
    }catch (error) {
      throw new Error(error.message)
    }
}

module.exports = blockUser