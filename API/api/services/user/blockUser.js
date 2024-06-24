const User = require("../../models/User")
const {
  errors: { notFound, custom: customErr },
  success: { custom }
} = require('../../../constants/index')

const blockUser = async(props)=>{
  const { name, loggedUserId } = props

  try{
    const blockedUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    /* Validations */
    if(!mainUser || !blockedUser)
      return notFound("User")
    if(blockUser.name == mainUser.name)
      return customErr(409, `You can not block yourself`)

    /* Unblock */
    if(mainUser.blocked_users.includes(blockedUser._id)){
      await User.updateOne({ name: mainUser.name }, { $pull: { blocked_users: blockedUser._id } })
      return custom(`${blockedUser.name} successfully unblocked`)
    }

    /* Block */
    await User.updateOne({ _id: loggedUserId }, {$push: { blocked_users: blockedUser._id }})
    blockedUser.followers = blockedUser.followers.filter((id) => id != loggedUserId)
    await blockedUser.save()
    
    return custom(`${blockedUser.name} successfully blocked`)
  }catch (error) {
    throw new Error(error.message)
  }
}

module.exports = blockUser