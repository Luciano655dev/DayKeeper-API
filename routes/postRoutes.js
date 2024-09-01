const express = require("express")
const router = express.Router()
const {
  getPostByName,
  createPost,
  updatePost,
  deletePost,
  reportPost,
  reactPost,
  commentPost,
  reactComment,
  deleteComment,
} = require("../api/controllers/postController")

// Middlewares
const multer = require("multer")
const multerConfig = require("../api/config/multer")
const handleMulterError = require("../middlewares/handleMulterError") // status de erro bonitinho do multer :)
const postValidation = require("../middlewares/validations/post/postValidation")
const postEditValidation = require("../middlewares/validations/post/postEditValidation")

const checkTokenMW = require("../middlewares/checkTokenMW")
const verifyPostOwnershipMW = require("../middlewares/verifyPostOwnershipMW")
const checkPrivateUserMW = require("../middlewares/checkPrivateUserMW")
const checkBlockedUserMW = require("../middlewares/checkBlockedUserMW")
const checkBannedUserMW = require("../middlewares/checkBannedUserMW")
const checkSameDayMW = require("../middlewares/checkSameDayMW")

const detectInappropriateFileMW = require("../middlewares/detectInappropriateFileMW")

// Routes
router.get(
  "/:name/:title",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  checkBlockedUserMW,
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
router.post(
  "/:name/:title/report",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  reportPost
) // Report a post
router.post(
  "/:name/:title/like",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  checkBlockedUserMW,
  reactPost
) // React to a Post
router.post(
  "/:name/:title/comment",
  checkTokenMW,
  checkSameDayMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  checkBlockedUserMW,
  commentPost
) // Comment in a post
router.delete("/:name/:title/comment/:usercomment", checkTokenMW, deleteComment) // Delete a comment
router.post(
  "/:name/:title/like/:usercomment",
  checkTokenMW,
  checkSameDayMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  checkBlockedUserMW,
  reactComment
) // Like a comment

/*
  GET /:name/:title/likes
  GET /:name/:title/comments
  GET /:name/:title/:userComment/likes
*/

module.exports = router
