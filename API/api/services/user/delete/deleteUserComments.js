const Post = require('../../../models/Post')

const deleteUserComments = async(loggedUserId)=>{
  try{
    const response = await Post.updateMany({}, {
      $pull: {
        comments: { user: loggedUserId }
      }
    })

    return response.nModified
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deleteUserComments