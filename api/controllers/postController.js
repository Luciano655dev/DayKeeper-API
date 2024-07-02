const { errors: { serverError } } = require("../../constants/index")
const getPost = require('../services/post/getPost')
const createPost = require('../services/post/createPost')
const updatePost = require('../services/post/updatePost')
const deletePost = require('../services/post/deletePost')
const reportPost = require('../services/post/reportPost')
const reactPost = require('../services/post/reactPost')
const commentPost = require('../services/post/commentPost')
const reactComment = require('../services/post/reactComment')
const deleteComment = require('../services/post/deleteComment')

// getPostByName
const getPostController = async(req, res)=>{
  try {
    const { code, message, post } = await getPost({
      ...req.params,
      queryParams: req.query.populate
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// submitPost
const createPostController = async(req, res)=>{
  const files = req?.files ? req?.files.map( file => {
    return {
      name: file.originalname,
      key: file.key,
      mimetype: file.mimetype,
      url: file.location
    }
  }) : []

  try{
    const { code, message, post } = await createPost({
      ...req.body,
      loggedUser: req.user,
      files
    })

    return res.status(code).json({ message, post })
  } catch (error){
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// updatePost
const updatePostController = async(req, res)=>{
  try{
    const { code, message, post } = await updatePost({
      newData: req.body,
      ...req.params, // { posttitle }
      loggedUser: req.user,
      reqFiles: req.files
    })

    return res.status(code).json({ message, post })
  } catch (error){
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// deletePost
const deletePostController = async(req, res)=>{
  try{
    const { code, message, post } = await deletePost({
      ...req.params,
      loggedUser: req.user
    })

    return res.status(code).json({ message, post })
  }catch(error){
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// report Post
const reportPostController = async(req, res)=>{
  const reason = req.body.reason || ''

  try{
    const { code, message, post } = await reportPost({
      ...req.params,
      reason,
      loggedUser: req.user
    })

    return res.status(code).json({ message, reason, post })
  }catch(error){
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// reactPost
const reactPostController = async (req, res) => {
  try {
    const { code, message, post } = await reactPost({
      ...req.params,
      loggedUser: req.user,
      ...req.body
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

//commentPost
const commentPostController = async(req, res)=>{
  try{
    const { code, message, post } = await commentPost({
      ...req.params,
      ...req.body,
      loggedUser: req.user
    })

    return res.status(code).json({ message, post })
  } catch (error){
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// reactComment
const reactCommentController = async (req, res) => {
  try {
    const { code, message, post } = await reactComment({
      ...req.params,
      ...req.body,
      loggedUser: req.user
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// deleteComment
const deleteCommentController = async (req, res) => {
  try{
    const { code, message, post } = await deleteComment({
      ...req.params,
      loggedUser: req.user
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

module.exports = {
  getPostByName: getPostController,
  createPost: createPostController,
  updatePost: updatePostController,
  deletePost: deletePostController,
  reportPost: reportPostController,
  reactPost: reactPostController,
  commentPost: commentPostController,
  reactComment: reactCommentController,
  deleteComment: deleteCommentController
}