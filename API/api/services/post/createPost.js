const Post = require('../../models/Post')
const formatDate = require("../../utils/formatDate")
const deleteFile = require('../../utils/deleteFile')
const { resetTime } = require('../../../config')

const {
  success: { created }
} = require('../../../constants')

const createPost = async(props)=>{
  const { data, loggedUserId, files } = props

  const titleDate = formatDate(Date.now())
  const title = `${titleDate.hour < resetTime ? titleDate.day - 1 : titleDate.day}-${titleDate.month}-${titleDate.year}`
  /*
    caso o usuario esteja postando antes do `resetTime`,
    o título será do dia anterios
  */

  try{
    /* Create post */
    const post = new Post({
      title,
      data,
      files,
      user: loggedUserId,
      created_at: Date.now(),
      reactions: [],
      comments: []
    })

    await post.save()

    return created(`post`, { post })
  } catch (error){
    /* Delete previous files */
    for(let i in req.files)
      deleteFile(req.files[i].key)

    throw new Error(error.message)
  }
}

module.exports = createPost