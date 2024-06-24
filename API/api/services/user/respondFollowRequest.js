const User = require('../../models/User')
const {
  errors: { notFound, unauthorized, custom: customErr },
  success: { custom }
} = require('../../../constants/index')

const respondeFollowRequest = async(props)=>{
  const { name, response, loggedUserId } = props
  
  try{
    const followUser = await User.findOne({ name })
    const mainUser = await User.findById(loggedUserId)

    /* Validations */
    if(!followUser || !mainUser)
      return notFound("User")
    if(!mainUser.private)
      return unauthorized(`answer follow request`, "Only private accounts can respond to requests")
    if( !mainUser.follow_requests.includes(followUser._id) )
      return customErr(404, "This user did not send you any requests")

    /* Remove user's follow request */
    await User.updateOne({ name: mainUser.name }, { $pull: { follow_requests: followUser._id } })

    /* DENIED */
    if(!response)
      return custom(`You denied ${followUser.name}'s request`)

    /* ACCEPTED */
    await User.updateOne({ name: mainUser.name }, { $push: { followers: followUser._id } })

    return custom(`You accepted ${followUser.name}'s request`)
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = respondeFollowRequest