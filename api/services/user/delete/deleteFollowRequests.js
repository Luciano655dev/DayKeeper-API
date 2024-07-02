const User = require('../../../models/User')

const deleteFollowRequests = async(loggedUserId)=>{
  try{
    const response = await User.updateMany({}, {
      $pull: {
        follow_requests: { user: loggedUserId }
      }
    })
  
    return response.nModified
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deleteFollowRequests