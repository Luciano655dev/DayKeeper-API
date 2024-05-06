const Post = require('../../models/Post')
const deleteFile = require('../../utils/deleteFile')
const { notFound } = require("../../../constants")

const deletePost = async(props)=>{
    const {
        posttitle,
        loggedUserId
    } = props
  
    try{
      const deletedPost = await Post.findOneAndDelete({
        title: posttitle,
        user: loggedUserId
      })
  
      if(!deletedPost)
        return { code: 404, message: notFound('Post') }
  
      for(let i in deletedPost.files)
        deleteFile(deletedPost.files[i].key)
  
      return { code: 200, message: "Post deleted successfully", post: deletedPost }
    }catch(error){
      throw new Error(error.message)
    }
}

module.exports = deletePost