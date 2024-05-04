const express = require('express')
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
    deleteComment
} = require('../api/controllers/postController')

// Middlewares
const multer = require('multer')
const multerConfig = require('../api/config/multer')
const handleMulterError = require('../middlewares/handleMulterError') // status de erro bonitinho do multer :)
const postValidation = require('../middlewares/validations/post/postValidation')
const postEditValidation = require('../middlewares/validations/post/postEditValidation')

const checkTokenMW = require('../middlewares/checkTokenMW')
const verifyUserOwnershipMW = require('../middlewares/verifyUserOwnershipMW')
const checkPrivateUserMW = require('../middlewares/checkPrivateUserMW')
const checkBlockedUserMW = require('../middlewares/checkBlockedUserMW')
const checkBannedUserMW = require('../middlewares/checkBannedUserMW')

// Routes
router.get("/:name/:posttitle", checkTokenMW, checkBannedUserMW, checkPrivateUserMW, checkBlockedUserMW, getPostByName) // One Post
router.post('/create', checkTokenMW, multer(multerConfig("both")).array('files', 5), handleMulterError, postValidation, createPost) // Create Post
router.put("/:posttitle", checkTokenMW, verifyUserOwnershipMW, multer(multerConfig("both")).array('files', 5), handleMulterError, postEditValidation, updatePost) // Edit Post
router.delete("/:posttitle", checkTokenMW, verifyUserOwnershipMW, deletePost) // Delete Post

// interaction
router.post("/:name/:posttitle/report", checkTokenMW, checkBannedUserMW, checkPrivateUserMW, reportPost) // Report a post
router.post("/:name/:posttitle/react", checkTokenMW, checkBannedUserMW, checkPrivateUserMW, checkBlockedUserMW, reactPost) // React to a Post
router.post("/:name/:posttitle/comment", checkTokenMW, checkBannedUserMW, checkPrivateUserMW, checkBlockedUserMW, commentPost) // Comment in a post
router.delete("/:name/:posttitle/comment/:usercomment", checkBannedUserMW, checkPrivateUserMW, checkBlockedUserMW, checkTokenMW, deleteComment) // Delete a comment
router.post("/:name/:posttitle/reactcomment/:usercomment", checkTokenMW, checkBannedUserMW, checkPrivateUserMW, checkBlockedUserMW, reactComment) // React to a comment in a Post

module.exports = router