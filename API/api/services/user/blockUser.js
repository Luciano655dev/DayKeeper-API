const User = require("../../models/User")
const {
  errors: { notFound, custom: customErr },
  success: { custom }
} = require('../../../constants/index')

const blockUser = async(props)=>{
  const { name, loggedUser } = props

  try{
    const blockedUser = await User.findOne({ name })

    /* Validations */
    if(!loggedUser || !blockedUser)
      return notFound("User")
    if(blockUser.name == loggedUser.name)
      return customErr(409, `You can not block yourself`)

    /* Unblock */
    if(loggedUser.blocked_users.includes(blockedUser._id)){
      await User.updateOne({ name: loggedUser.name }, { $pull: { blocked_users: blockedUser._id } })
      return custom(`${blockedUser.name} successfully unblocked`)
    }

    /* Block */
    await User.updateOne({ _id: loggedUser._id }, {$push: { blocked_users: blockedUser._id }})
    blockedUser.followers = blockedUser.followers.filter((id) => id != loggedUser._id)
    await blockedUser.save()
    
    return custom(`${blockedUser.name} successfully blocked`)
  }catch (error) {
    throw new Error(error.message)
  }
}

module.exports = blockUser