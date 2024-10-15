const express = require("express")
const router = express.Router()
const {
  getPostByName,
  createPost,
  updatePost,
  deletePost,
  reportPost,
  likePost,
  getPostLikes,
  getPostComments,
  commentPost,
  likeComment,
  getCommentLikes,
  deleteComment,
} = require("../api/controllers/postController")

// Middlewares
const multer = require("multer")
const multerConfig = require("../api/config/multer")
const handleMulterError = require("../middlewares/handleMulterError") // status de erro bonitinho do multer :)
const postValidation = require("../middlewares/validations/post/postValidation")
const postEditValidation = require("../middlewares/validations/post/postEditValidation")

const checkTokenMW = require("../middlewares/checkTokenMW")
const checkValidUserMW = require("../middlewares/checkValidUserMW")
const checkBannedUserMW = require("../middlewares/checkBannedUserMW")
const checkElementPrivacy = require("../middlewares/checkElementPrivacyMW")
const checkSameDayMW = require("../middlewares/checkSameDayMW")

const detectInappropriateFileMW = require("../middlewares/detectInappropriateFileMW")

// Routes
router.get(
  "/:name/:title",
  checkTokenMW,
  checkValidUserMW,
  checkElementPrivacy("post"),
  getPostByName
) // One Post
router.post(
  "/create",
  checkTokenMW,
  multer(multerConfig("both")).array("files", 5),
  detectInappropriateFileMW,
  handleMulterError,
  postValidation,
  createPost
) // Create Post
router.put(
  "/:title",
  checkTokenMW,
  checkSameDayMW,
  multer(multerConfig("both")).array("files", 5),
  detectInappropriateFileMW,
  handleMulterError,
  postEditValidation,
  updatePost
) // Edit Post
router.delete("/:title", checkTokenMW, deletePost) // Delete Post

// ========== interaction ==========
router.post("/:name/:title/report", checkTokenMW, checkBannedUserMW, reportPost) // Report a post
router.post("/:name/:title/like", checkTokenMW, checkValidUserMW, likePost) // Like a Post
router.get(
  "/:name/:title/likes",
  checkTokenMW,
  checkValidUserMW,
  checkElementPrivacy("post"),
  getPostLikes
) // get post likes
router.post(
  "/:name/:title/comment",
  checkTokenMW,
  checkSameDayMW,
  checkValidUserMW,
  commentPost
) // Comment in a post
router.get(
  "/:name/:title/comments",
  checkTokenMW,
  checkValidUserMW,
  checkElementPrivacy("post"),
  getPostComments
) // Get Post COmments
router.delete("/:name/:title/comment/:usercomment", checkTokenMW, deleteComment) // Delete a comment
router.post(
  "/:name/:title/like/:usercomment",
  checkTokenMW,
  checkSameDayMW,
  checkValidUserMW,
  likeComment
) // Like a comment
router.get(
  "/:name/:title/:usercomment/likes",
  checkTokenMW,
  checkValidUserMW,
  checkElementPrivacy("post"),
  getCommentLikes
)

module.exports = router
