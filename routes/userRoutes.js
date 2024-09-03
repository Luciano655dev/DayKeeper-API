const express = require("express")
const router = express.Router()
const {
  getUser,
  getUserPosts,
  updateUser,
  reseteProfilePicture,
  deleteUser,
  followUser,
  getFollowing,
  getFollowers,
  getFollowRequests,
  respondFollowRequest,
  removeFollower,
  blockUser,
  getBlockedUsers,
  reportUser,
} = require("../api/controllers/userController")

// Middlewares
const multer = require("multer")
const multerConfig = require("../api/config/multer")
const handleMulterError = require("../middlewares/handleMulterError")
const userEditValidation = require("../middlewares/validations/user/userEditValidation")
const checkTokenMW = require("../middlewares/checkTokenMW")
const checkBannedUserMW = require("../middlewares/checkBannedUserMW")
const checkPrivateUserMW = require("../middlewares/checkPrivateUserMW")

const detectInappropriateFileMW = require("../middlewares/detectInappropriateFileMW")

// Routes
router.get("/:name", checkTokenMW, checkBannedUserMW, getUser)
router.put(
  "/update_user",
  checkTokenMW,
  multer(multerConfig("image")).single("file"),
  detectInappropriateFileMW,
  handleMulterError,
  userEditValidation,
  updateUser
)
router.put("/reset_profile_picture", checkTokenMW, reseteProfilePicture)
router.delete("/delete_user", checkTokenMW, deleteUser)

// Follows
router.get(
  "/:name/followers",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  getFollowers
)
router.get(
  "/:name/following",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  getFollowing
)
router.get(
  /*
    the 'name' here does not make any fucking difference
    since you're the only one who can see your follow requests
  */
  "/:name/follow_requests",
  checkTokenMW,
  getFollowRequests
)
router.post("/:name/follow", checkTokenMW, checkBannedUserMW, followUser)
router.post(
  "/:name/respond_follow",
  checkTokenMW,
  checkBannedUserMW,
  respondFollowRequest
)
router.delete(
  "/:name/remove_follower",
  checkTokenMW,
  checkBannedUserMW,
  removeFollower
)

// Interactions
router.post("/:name/block", checkTokenMW, checkBannedUserMW, blockUser)
router.get(
  "/:name/get_blocks",
  /*
    the 'name' here does not make any fucking difference
    since you're the only one who can see your follow requests
  */
  checkTokenMW,
  getBlockedUsers
)
router.post("/:name/report", checkTokenMW, checkBannedUserMW, reportUser)

// posts
router.get(
  "/:name/posts",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  getUserPosts
)

module.exports = router
