const User = require('../../../models/User')

const deleteFollowers = async(loggedUserId)=>{
  try{
    const response = await User.updateMany({}, {
      $pull: {
        followers: { user: loggedUserId }
      }
    })

    return response.nModified
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deleteFollowers