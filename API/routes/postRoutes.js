const express = require('express')
const router = express.Router()
const {
    getPostByName,
    createPost,
    updatePost,
    deletePost,
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

// Routes
router.get("/:name/:posttitle", checkTokenMW, checkPrivatePostMW, checkBlockedUserMW, getPostByName) // One Post
router.post('/create', checkTokenMW, multer(multerConfig).array('files', 5), handleMulterError, postValidation, createPost) // Create Post
router.put("/:posttitle", checkTokenMW, verifyUserOwnershipMW, multer(multerConfig).array('files', 5), handleMulterError, postEditValidation, updatePost) // Edit Post
router.delete("/:posttitle", checkTokenMW, verifyUserOwnershipMW, deletePost) // Delete Post

// interaction
router.post("/:name/:posttitle/react", checkTokenMW, checkPrivatePostMW, checkBlockedUserMW, reactPost) // React to a Post
router.post("/:name/:posttitle/comment", checkTokenMW, checkPrivatePostMW, checkBlockedUserMW, commentPost) // Comment in a post
router.delete("/:name/:posttitle/comment/:usercomment", checkPrivatePostMW, checkBlockedUserMW, checkTokenMW, deleteComment) // Delete a comment
router.post("/:name/:posttitle/reactcomment/:usercomment", checkTokenMW, checkPrivatePostMW, checkBlockedUserMW, reactComment) // React to a comment in a Post

module.exports = router