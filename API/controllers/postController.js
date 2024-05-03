require('dotenv').config()
const User = require('../models/User')
const Post = require('../models/Post')
const deleteFile = require('../common/deleteFile')
const bf = require('better-format')
const axios = require('axios')

// getPostByName
const getPostByName = async(req, res)=>{
  try {
    const { posttitle, name: username } = req.params
    const post = await getPost(posttitle, username)
    if (!post) return res.status(404).json({ message: "Post not found" })

    return res.status(200).json({ post })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// submitPost
const createPost = async(req, res)=>{
  const { data } = req.body
  const files = req.files ? req.files.map( file => {
                      return {
                        name: file.originalname,
                        key: file.key,
                        mimetype: file.mimetype,
                        url: file.location
                      }
                    }) : []
  const loggedUserId = req.id

  const titleDate = bf.FormatDate(Date.now())
  const resetTime = process.env.RESET_TIME
  const title = `${titleDate.hour < resetTime ? titleDate.day - 1 : titleDate.day}-${titleDate.month}-${titleDate.year}`

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

    return res.status(201).json({ message: "Post deleted successfully", post }) // typeof 'user' == ObjectId
  } catch (error){
    /* Delete previous files */
    for(let i in req.files)
      deleteFile(req.files[i].key)

    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// updatePost
const updatePost = async(req, res)=>{
  const newData = req.body
  const { posttitle } = req.params
  const loggedUserId = req.id

  try{
    const post = await getPostByUserId(posttitle, loggedUserId)
    if(!post) return res.status(404).json({ message: "Post not found" })

    /* Verify File Limit */
    const keep_files = req.body.keep_files.split('').map(Number) || []
    const maxFiles = ((post.files.length - 1) - (post.files.length - keep_files.length)) + req.files.length
    if(maxFiles > 5){
      /* Delete previous files */
      for(let i in req.files)
        deleteFile(req.files[i].key)

      return res.status(413).json({ message: "You can only send up to 5 (five) files" })
    }

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
      { title: posttitle, user: loggedUserId },
      {
        $set: {
          ...newData,
          title: posttitle,
          files,
          user: loggedUserId,
          created_at: post.created_at,
          edited_at: Date.now(),
          reactions: post.reactions,
          comments: post.comments,
          _id: post._id
        }
      },
      { new: true }
    )

    if(!updatePost) return res.status(404).json({ message: "Post not found" })
    if(JSON.stringify(post) == JSON.stringify(updatedPost)) return res.status(204).json({ message: "The haven't changed" })

    await updatedPost.save()

    return res.status(200).json({ message: "Post updated successfully", post: updatedPost }) // typeof 'user' == ObjectId
  } catch (error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// deletePost
const deletePost = async(req, res)=>{
  const loggedUserId = req.id

  try{
    const { posttitle } = req.params

    const deletedPost = await Post.findOneAndDelete({
      title: posttitle,
      user: loggedUserId
    })

    if(!deletedPost)
      return res.status(404).json({ msg: "Post not found" })

    for(let i in deletedPost.files)
      deleteFile(deletedPost.files[i].key)

    return res.status(200).json({ message: "Post deleted successfully", post: deletedPost }) // typeof 'user' == ObjectId
  }catch(error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// report Post
const reportPost = async(req, res)=>{
  const { name: username, posttitle } = req.params
  const reason = req.body.reason || ''
  const loggedUserId = req.id
  const maxReasonLength = 1000

  if(reason.length > maxReasonLength)
    return res.status(413).json({ message: "The reason is too long" })

  try{
    const postUser = await User.findOne({ name: username })
    const reportedPost = await Post.findOne({
      user: postUser._id,
      title: posttitle
    })
    if(!reportedPost) return res.status(404).json({ message: "Post not found" })

    if(reportedPost.reports.find(report => report.user == loggedUserId))
      return res.status(409).json({ message: "You have already reported this post" })

    await Post.findByIdAndUpdate(reportedPost._id, {
      $addToSet: {
        reports: {
          user: loggedUserId,
          reason
        }
      }
    })

    return res.status(200).json({
      message: "Post reported successfully",
      reason,
      post: reportedPost
    })
  }catch(error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// reactPost
const reactPost = async (req, res) => {
  const loggedUserId = req.id
  const { name: username, posttitle } = req.params

  const reaction = req.body.reaction
  if (reaction < 0 || reaction >= 5)
    return res.status(400).json({ message: "The reaction needs to be filled in" })

  try {
    const user = await User.findOne({ name: username })
    let reactedPost = await getPostByUserId(posttitle, user._id)

    /* Verify if the user has reacted before */
    const existingReactionIndex = reactedPost.reactions.findIndex(
      (reaction) =>
        reaction.user._id == loggedUserId ||
        reaction.user == loggedUserId
    )

    /* if true */
    if (existingReactionIndex !== -1) {
      if (reactedPost.reactions[existingReactionIndex].reaction === reaction) {
        /* If it's the same reaction, remove */
        reactedPost.reactions.splice(existingReactionIndex, 1)
      } else {
        /* If it's a different reaction, update */
        reactedPost.reactions[existingReactionIndex].reaction = reaction
      }
    } else {
      /* If false, add new reaction */
      reactedPost.reactions.push({ user: loggedUserId, reaction })
    }

    await reactedPost.save()

    return res.status(200).json({
      message: "The reaction was added or removed from the post",
      post: reactedPost
    })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

//commentPost
const commentPost = async(req, res)=>{
  let { comment, gif } = req.body
  const { name: username, posttitle } = req.params
  const loggedUserId = req.id
  const maxCommentLength = 1000
  const errorGifUrl = 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzc0OGh3NWQxbTdqcjZqaDZudXQyMHM3b3VpdXF4czczaGl4bHZicyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8L0Pky6C83SzkzU55a/giphy.gif'

  /* Validations */
  if(!comment)
    return res.status(400).json({ message: "The comment needs to be filled in" })
  if(comment.length > maxCommentLength)
    return res.status(413).json({ message: "The comment is too long" })

  try{
    const post = await getPost(posttitle, username)
    if(!post) return res.status(404).json({ message: "Post not found" })

    if(gif){
      try {
        const apiKey = process.env.GIPHY_API_KEY
        gif = await axios.get(`https://api.giphy.com/v1/gifs/${gif}?api_key=${apiKey}`)

        gif = {
          name: gif.data.data.title,
          id: gif.data.data.id,
          url: gif.data.data.images.original.url
        }
      }catch(err){
        gif = {
          name: '404',
          id: '',
          url: errorGifUrl
        }

        /* Error in Giphy API */
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

    const user = await User.findOne({ name: username })
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
        match: { banned: { $ne: true } }, // Excluir comentários feitos por usuários banidos
        select: '-password -ban_history -reports -follow_requests -blocked_users'
      }
    })
    if (!commentedPost) return res.status(404).json({ message: "Post not found" })

    await commentedPost.save()

    return res.status(200).json({ message: "Post commented successfully", post: commentedPost })
  } catch (error){
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// reactComment
const reactComment = async (req, res) => {
  const { name: username, posttitle, usercomment } = req.params
  const loggedUserId = req.id

  const reaction = req.body.reaction
  if (reaction < 0 || reaction > 5)
    return res.status(422).json({ message: "The reaction needs to be filled in" })

  try {
    const userCommentId = (await User.findOne({ name: usercomment }))._id.toString()
    const post = await getPost(posttitle, username)

    const userCommentIndex = post.comments.findIndex((comment) => comment.user._id == userCommentId)
    if (userCommentIndex === -1) return res.status(404).json({ message: "Comment not found" })

    /* Verify if the user has reacted before */
    const existingReactionIndex = post.comments[userCommentIndex].reactions.findIndex(
      (reactionObj) => reactionObj.user === loggedUserId
    )

    /* if true */
    if (existingReactionIndex !== -1){
      if (post.comments[userCommentIndex].reactions[existingReactionIndex].reaction === reaction) {
        /* If it's the same reaction, remove */
        post.comments[userCommentIndex].reactions.splice(existingReactionIndex, 1)
      } else {
        /* If it's a different reaction, update */
        post.comments[userCommentIndex].reactions[existingReactionIndex].reaction = reaction
      }
    } else {
      /* If false, add new reaction */
      post.comments[userCommentIndex].reactions.push({ user: loggedUserId, reaction })
    }

    await post.save()

    return res.status(200).json({ message: "The reaction was added or removed from the comment", post })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

// deleteComment
const deleteComment = async (req, res) => {
  const { name: username, posttitle, usercomment } = req.params
  const userLoggedId = req.id

  try{
    const userComment = await User.findOne({ name: usercomment })
    const mainUser = await User.findOne({ name: username })

    const post = await getPost(posttitle, username)

    /* Find comment index */
    const userCommentIndex = post.comments.findIndex((comment) => comment.user == userComment._id)
    if (userCommentIndex === -1)
      return res.status(404).json({ message: "Comment not found" })

    /* Verify if the user is the post owner or the comment owner */
    if (
      post.user !== userLoggedId &&
      post.user !== mainUser._id
    ) return res .status(403).json({ message: "You can not delet this comment" });

    /* Remove user comment */
    post.comments.splice(userCommentIndex, 1)

    /* Update */
    const user = await User.findOne({ name: username })
    const updatedPost = await Post.findOneAndUpdate(
      { title: posttitle, user: user.id },
      {
        comments: [...post.comments],
      },
      { new: true }
    ).populate('user', '-password -ban_history -reports -follow_requests -blocked_users')

    if (!updatedPost)
      return res.status(404).json({ message: "Post not foudn" })

    await updatedPost.save()

    return res.status(200).json({ message: "Comment removed successfully", post: updatedPost })
  } catch (error) {
    return res.status(500).json({
      message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`
    })
  }
}

module.exports = {
  getPostByName,
  createPost,
  updatePost,
  deletePost,
  reportPost,
  reactPost,
  commentPost,
  reactComment,
  deleteComment
}

// ==================== COMMON FUNCTIONS ====================
async function getPost(posttitle, username){
  try{
    const user = await User.findOne({ name: username })
    const post = await Post.findOne({ user: user._id, title: posttitle })
      .populate('user', '-password -ban_history -reports -follow_requests -blocked_users')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          match: { banned: { $ne: true } }, // Excluir comentários feitos por usuários banidos
          select: '-password -ban_history -reports -follow_requests -blocked_users'
        }
      })
      .populate('reactions.user', '-password -ban_history -reports -follow_requests -blocked_users')
  
    return post
  }catch(err){
    return null
  }
}

async function getPostByUserId(posttitle, userid){
  try{
    const post = await Post.findOne({ user: userid, title: posttitle })
      .populate('user', '-password -ban_history -reports -follow_requests -blocked_users')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          match: { banned: { $ne: true } }, // Excluir comentários feitos por usuários banidos
          select: '-password -ban_history -reports -follow_requests -blocked_users'
        }
      })
      .populate('reactions.user', '-password -ban_history -reports -follow_requests -blocked_users')
  
    return post
  }catch(err){
    return null
  }
}