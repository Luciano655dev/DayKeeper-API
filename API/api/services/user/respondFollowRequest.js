const User = require('../../models/User')
const { notFound } = require('../../../constants')

const respondeFollowRequest = async(props)=>{
    const { name, response, loggedUserId } = props
    
    try{
      const followUser = await User.findOne({ name })
      const mainUser = await User.findById(loggedUserId)
  
      /* Validations */
      if(!followUser || !mainUser)
        return { code: 404, message: notFound("User") }
      if(!mainUser.private)
        return { code: 403, message: "Only private accounts can respond to requests" }
      if( !mainUser.follow_requests.includes(followUser._id) )
        return { code: 404, message: "This user did not send you any requests" }
  
      /* Remove user's follow request */
      await User.updateOne({ name: mainUser.name }, { $pull: { follow_requests: followUser._id } })
  
      /* DENIED */
      if(!response)
        return { code: 200, message: `You denied ${followUser.name}'s request` }
  
      /* ACCEPTED */
      await User.updateOne({ name: mainUser.name }, { $push: { followers: followUser._id } })

      return { code: 202, message: `You accepted ${followUser.name}'s request` }
    }catch(error){
      throw new Error(error.message)
    }
}

module.exports = respondeFollowRequest