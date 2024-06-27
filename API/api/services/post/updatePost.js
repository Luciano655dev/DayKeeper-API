const Post = require('../../models/Post')
const deleteFile = require('../../utils/deleteFile')
const findPost = require('./get/findPost')
const {
  errors: { notFound, inputTooLong },
  success: { updated }
} = require('../../../constants/index')

const updatePost = async(req)=>{
  const newData = req.body
  const { posttitle } = req.params
  const loggedUser = req.user

  try{
    const handleBadRequest = (returnObj) => {
      for(let i in req.files)
        deleteFile(req.files[i].key)

      return returnObj
    }

    const post = await findPost(
      loggedUser._id,
      posttitle,
      'userId',
      [ 'user' ]
    )
    if(!post)
      return handleBadRequest(notFound('Post'))

    /* Verify File Limit */
    const keep_files = req.body.keep_files.split('').map(Number) || []
    const maxFiles = ((post.files.length - 1) - (post.files.length - keep_files.length)) + req.files.length
    if(maxFiles >= 5)
      return handleBadRequest(inputTooLong(`image field`))

    /* Delete files from original post */
    let files = post.files

    for(let i=0; i<post.files.length; i++){
      if(keep_files.includes(i)) continue

      deleteFile(post.files[i].key)
    }
    
    const newPostfiles = files.filter((el, index)=>keep_files.includes(index))
    const newFiles = req.files.map( file => { return { name: file.originalname, key: file.key, mimetype: file.mimetype, url: file.location } })
    files = [...newPostfiles, ...newFiles]
  
    /* Create Post */
    const updatedPost = await Post.findOneAndUpdate(
      { title: posttitle, user: loggedUser._id },
      {
        $set: {
          ...newData,
          title: posttitle,
          files,
          user: loggedUser._id,
          created_at: post.created_at,
          edited_at: Date.now(),
          reactions: post.reactions,
          comments: post.comments,
          _id: post._id
        }
      },
      { new: true }
    )

    // Debug
    if(JSON.stringify(post) == JSON.stringify(updatedPost))
      return { code: 204, message: "The haven't changed" }

    await updatedPost.save()

    return updated(`post`)
  }catch (error){
    for(let i in newFiles)
      deleteFile(newFiles[i].key)
    
    throw new Error(error.message)
  }
}

module.exports = updatePost