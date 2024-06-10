const Storie = require('../../../models/Storie')

const deleteStories = async(loggedUserId)=>{
  try{
    const response = await Storie.deleteMany({ user: loggedUserId })

    return response.nModified
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deleteStories