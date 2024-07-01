const Post = require('../../../models/Post')

const deletePostsLikes = async(loggedUserId)=>{
  try{
    const response = await Post.updateMany({}, {
      $pull: {
        likes: loggedUserId
      }
    })
  
    return response.nModified
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deletePostsLikes