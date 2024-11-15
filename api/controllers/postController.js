const {
  errors: { serverError },
} = require("../../constants/index")
const getPost = require("../services/post/getPost")
const createPost = require("../services/post/createPost")
const updatePost = require("../services/post/updatePost")
const deletePost = require("../services/post/deletePost")
const reportPost = require("../services/post/reportPost")
const likePost = require("../services/post/likePost")
const getPostLikes = require("../services/post/getPostLikes")
const commentPost = require("../services/post/commentPost")
const getPostComments = require("../services/post/getPostComments")
const likeComment = require("../services/post/likeComment")
const getCommentLikes = require("../services/post/getCommentLikes")
const deleteComment = require("../services/post/deleteComment")

// getPostByName
const getPostController = async (req, res) => {
  try {
    const { code, message, post } = await getPost({
      ...req.params,
      queryParams: req.query.populate,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// submitPost
const createPostController = async (req, res) => {
  const files = req?.files
    ? req?.files.map((file) => {
        return {
          name: file.originalname,
          key: file.key,
          mimetype: file.mimetype,
          url: file.url,
        }
      })
    : []

  try {
    const { code, message, post } = await createPost({
      ...req.body,
      loggedUser: req.user,
      files,
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// updatePost
const updatePostController = async (req, res) => {
  try {
    const { code, message, post } = await updatePost({
      ...req.body,
      ...req.params,
      loggedUser: req.user,
      reqFiles: req.files,
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// deletePost
const deletePostController = async (req, res) => {
  try {
    const { code, message, post } = await deletePost({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// report Post
const reportPostController = async (req, res) => {
  const reason = req.body.reason || ""

  try {
    const { code, message } = await reportPost({
      ...req.params,
      reason,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, reason })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

// likePost
const likePostController = async (req, res) => {
  try {
    const { code, message, post } = await likePost({
      ...req.params,
      loggedUser: req.user,
      ...req.body,
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

const getPostLikesController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await getPostLikes({
      ...req.params,
      loggedUser: req.user,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

//commentPost
const commentPostController = async (req, res) => {
  try {
    const { code, message, response } = await commentPost({
      ...req.params,
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

//commentPost
const getPostCommentsController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await getPostComments({
      ...req.params,
      loggedUser: req.user,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

// likeComment
const likeCommentController = async (req, res) => {
  try {
    const { code, message, post } = await likeComment({
      ...req.params,
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, post })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.toString()) })
  }
}

const getCommentLikesController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await getCommentLikes({
      ...req.params,
      loggedUser: req.user,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

// deleteComment
const deleteCommentController = async (req, res) => {
  try {
    const { code, message, response } = await deleteComment({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, ...response })
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
  likePost: likePostController,
  getPostLikes: getPostLikesController,
  commentPost: commentPostController,
  getPostComments: getPostCommentsController,
  likeComment: likeCommentController,
  getCommentLikes: getCommentLikesController,
  deleteComment: deleteCommentController,
}
