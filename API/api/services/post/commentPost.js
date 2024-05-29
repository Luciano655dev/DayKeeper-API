const User = require("../../models/User")
const Post = require("../../models/Post")
const axios = require('axios')
const findPost = require('./get/findPost')
const { giphy: { apiKey } } = require('../../../config')
const { hideUserData } = require('../../repositories')

const {
  post: { maxCommentLength },
  errors: { fieldsNotFilledIn, inputTooLong, notFound },
  errroGif,
  success: { created }
} = require('../../../constants')

const commentPost = async(props)=>{
  let {
    loggedUserId,
    name: username,
    posttitle,
    comment,
    gif
  } = props

  /* Validations */
  if(!comment)
    return fieldsNotFilledIn(`comment`)
  if(comment.length > maxCommentLength)
    return inputTooLong('Comment')

  try{
    const post = await findPost(
      username,
      posttitle,
      'username',
      []
  )
    const user = await User.findOne({ name: username })
    if(!post || !user)
      return notFound('Post or User')

    if(gif){
      try {
        gif = await axios.get(`https://api.giphy.com/v1/gifs/${gif}?api_key=${apiKey}`)

        gif = {
          name: gif.data.data.title,
          id: gif.data.data.id,
          url: gif.data.data.images.original.url
        }
      }catch(err){
        gif = errroGif

        /* Error in Giphy API debug */
        console.log(err)
      }
    }

    let newComments = [ ...post.comments, {
      created_at: Date.now(),
      user: loggedUserId,
      reactions: [],
      comment,
      gif
    }]

    /* Remove user's comment if exists */
    if(post.comments.findIndex(comment => comment.user._id == loggedUserId) !== -1)
      newComments = [...post.comments].filter( comment => comment.user._id != loggedUserId)

    const commentedPost = await Post.findOneAndUpdate(
      { title: posttitle, user: user._id },
      {
        comments: newComments
      },
      { new: true }
    ).populate({
      path: 'comments',
      populate: {
        path: 'user',
        match: { banned: { $ne: true } },
        select: hideUserData
      }
    })

    await commentedPost.save()

    return created(`comment`, { post: commentedPost })
  } catch (error){
    throw new Error(error.message)
  }
}

module.exports = commentPost