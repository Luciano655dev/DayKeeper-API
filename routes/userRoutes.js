const express = require("express")
const router = express.Router()
const {
  getUser,
  getUserPosts,
  getUserPostsByDay,
  updateUser,
  reseteProfilePicture,
  deleteUser,
  followUser,
  getFollowing,
  getFollowers,
  getFollowRequests,
  respondFollowRequest,
  removeFollower,
  addOrRemoveFromCloseFriends,
  getCloseFriends,
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
const checkValidUserMW = require("../middlewares/checkValidUserMW")
const checkBannedUserMW = require("../middlewares/checkBannedUserMW")

const detectInappropriateFileMW = require("../middlewares/detectInappropriateFileMW")

// Routes
router.get("/blocks", checkTokenMW, getBlockedUsers)
router.get("/follow_requests", checkTokenMW, getFollowRequests)
router.put(
  "/user",
  checkTokenMW,
  multer(multerConfig("image")).single("file"),
  handleMulterError,
  detectInappropriateFileMW,
  userEditValidation,
  updateUser
)
router.put("/reset_profile_picture", checkTokenMW, reseteProfilePicture)
router.delete("/user", checkTokenMW, deleteUser)

// Follows
router.get("/:name/followers", checkTokenMW, getFollowers)
router.get("/:name/following", checkTokenMW, getFollowing)
router.post("/:name/follow", checkTokenMW, checkValidUserMW, followUser)
router.post(
  "/:name/respond_follow",
  checkTokenMW,
  checkValidUserMW,
  respondFollowRequest
)
router.delete(
  "/:name/follower",
  checkTokenMW,
  checkBannedUserMW,
  removeFollower
)

// Close Friends
router.post(
  "/close_friends/:name",
  checkTokenMW,
  checkValidUserMW,
  addOrRemoveFromCloseFriends
)
router.get("/close_friends", checkTokenMW, getCloseFriends)

// Interactions
router.post("/:name/block", checkTokenMW, checkBannedUserMW, blockUser)
router.post("/:name/report", checkTokenMW, checkBannedUserMW, reportUser)

// posts
router.get("/:name/posts", checkTokenMW, checkValidUserMW, getUserPosts)
router.get("/:name/posts/:date", checkTokenMW, getUserPostsByDay)

// GET USER
router.get("/:name", checkTokenMW, getUser)

module.exports = router
