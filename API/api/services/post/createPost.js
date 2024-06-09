const Post = require('../../models/Post')
const formatDate = require("../../utils/formatDate")
const getTodayDate = require(`../../utils/getTodayDate`)
const deleteFile = require('../../utils/deleteFile')
const { resetTime } = require('../../../config')

const {
  success: { created }
} = require('../../../constants')

const createPost = async(props)=>{
  const { data, loggedUserId, files } = props
  const title = getTodayDate()

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