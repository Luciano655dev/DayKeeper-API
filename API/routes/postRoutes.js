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
} = require('../controllers/postController')

// Middlewares
const multer = require('multer')
const multerConfig = require('../config/multer')
const handleMulterError = require('../middlewares/handleMulterError') // status de erro bonitinho do multer :)
const postValidation = require('../middlewares/validations/postValidation')
const postEditValidation = require('../middlewares/validations/postEditValidation')

const checkTokenMW = require('../middlewares/checkTokenMW')
const verifyUserOwnershipMW = require('../middlewares/verifyUserOwnershipMW')
const checkPrivatePostMW = require('../middlewares/checkPrivatePostMW')
const checkBlockedUserMW = require('../middlewares/checkBlockedUserMW')
const checkBannedUserMW = require('../middlewares/checkBannedUserMW')

// Routes
router.get("/:name/:posttitle", checkTokenMW, checkBannedUserMW, checkPrivatePostMW, checkBlockedUserMW, getPostByName) // One Post
router.post('/create', checkTokenMW, multer(multerConfig("both")).array('files', 5), handleMulterError, postValidation, createPost) // Create Post
router.put("/:posttitle", checkTokenMW, verifyUserOwnershipMW, multer(multerConfig("both")).array('files', 5), handleMulterError, postEditValidation, updatePost) // Edit Post
router.delete("/:posttitle", checkTokenMW, verifyUserOwnershipMW, deletePost) // Delete Post

// interaction
router.post("/:name/:posttitle/report", checkTokenMW, checkBannedUserMW, checkPrivatePostMW, reportPost) // Report a post
router.post("/:name/:posttitle/react", checkTokenMW, checkBannedUserMW, checkPrivatePostMW, checkBlockedUserMW, reactPost) // React to a Post
router.post("/:name/:posttitle/comment", checkTokenMW, checkBannedUserMW, checkPrivatePostMW, checkBlockedUserMW, commentPost) // Comment in a post
router.delete("/:name/:posttitle/comment/:usercomment", checkBannedUserMW, checkPrivatePostMW, checkBlockedUserMW, checkTokenMW, deleteComment) // Delete a comment
router.post("/:name/:posttitle/reactcomment/:usercomment", checkTokenMW, checkBannedUserMW, checkPrivatePostMW, checkBlockedUserMW, reactComment) // React to a comment in a Post

module.exports = router