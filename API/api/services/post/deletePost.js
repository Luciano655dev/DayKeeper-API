const Post = require('../../models/Post')
const deleteFile = require('../../utils/deleteFile')
const {
  errors: { notFound },
  success: { deleted }
} = require("../../../constants/index")

const deletePost = async(props)=>{
  const {
    posttitle,
    loggedUser
  } = props

  try{
    const deletedPost = await Post.findOneAndDelete({
      title: posttitle,
      user: loggedUser._id
    })

    if(!deletedPost)
      return notFound('Post')

    for(let i in deletedPost.files)
      deleteFile(deletedPost.files[i].key)

    return deleted(`post`)
  }catch(error){
    throw new Error(error.message)
  }
}

module.exports = deletePost