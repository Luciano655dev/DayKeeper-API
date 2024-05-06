const Post = require('../../../models/Post')

const deletePostReactions = async(loggedUserId)=>{
  try{
    const response = await Post.updateMany({}, {
      $pull: {
        reactions: { user: loggedUserId }
      }
    })
  
    return response.nModified
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deletePostReactions