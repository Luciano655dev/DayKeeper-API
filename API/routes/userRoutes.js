const express = require('express')
const router = express.Router()
const {
    getUserByName,
    updateUser,
    reseteProfilePicture,
    deleteUser,
    followUser,
    getFollowing,
    getFollowers,
    respondFollowRequest,
    removeFollower,
    blockUser
} = require('../controllers/userController')

// Middlewares
const multer = require('multer')
const multerConfig = require('../config/multer')
const handleMulterError = require('../middlewares/handleMulterError')
const userEditValidation = require('../middlewares/validations/userEditValidation')
const checkTokenMW = require('../middlewares/checkTokenMW')

// Routes
router.get("/:name", checkTokenMW, getUserByName)
router.put("/update_user", checkTokenMW, multer(multerConfig).single('file'), handleMulterError, userEditValidation, updateUser)
router.put("/reset_profile_picture", checkTokenMW, reseteProfilePicture)
router.delete("/delete_user", checkTokenMW, deleteUser)

// Follows
router.get("/:name/followers", checkTokenMW, getFollowers)
router.get("/:name/following", checkTokenMW, getFollowing)
router.post("/:name/follow", checkTokenMW, followUser)
router.post("/:name/respond_follow", checkTokenMW, respondFollowRequest)
router.delete("/:name/remove_follow", checkTokenMW, removeFollower)

// Blocks
router.post("/:name/block", checkTokenMW, blockUser)

module.exports = router