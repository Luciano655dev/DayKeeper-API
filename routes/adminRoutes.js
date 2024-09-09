const express = require("express")
const router = express.Router()
const {
  deleteReport,

  getReportedUsers,
  getBannedUsers,
  banOrUnbanUser,
  deleteBannedUser,

  getReportedPosts,
  getBannedPosts,
  banOrUnbanPost,
  deleteBannedPost,

  banOrUnbanStorie,
  deleteBannedStorie,
  getReportedStories,
  getBannedStories,
} = require("../api/controllers/adminController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const checkAdminMW = require("../middlewares/checkAdminMW")

router.delete("/report/:reportId", checkTokenMW, checkAdminMW, deleteReport)

// User
router.get("/reportedUsers", checkTokenMW, checkAdminMW, getReportedUsers)
router.get("/bannedUsers", checkTokenMW, checkAdminMW, getBannedUsers)
router.post("/:name/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanUser)
router.delete("/:name", checkTokenMW, checkAdminMW, deleteBannedUser)

// Post
router.get("/reportedPosts", checkTokenMW, checkAdminMW, getReportedPosts)
router.get("/bannedPosts", checkTokenMW, checkAdminMW, getBannedPosts)
router.post(
  "/:name/:title/banOrUnban",
  checkTokenMW,
  checkAdminMW,
  banOrUnbanPost
)
router.delete("/:name/:title/", checkTokenMW, checkAdminMW, deleteBannedPost)

// Storie
router.get("/reportedStories", checkTokenMW, checkAdminMW, getReportedStories)
router.get("/bannedStories", checkTokenMW, checkAdminMW, getBannedStories)
router.post(
  "/storie/:name/:storieId/banOrUnban",
  checkTokenMW,
  checkAdminMW,
  banOrUnbanStorie
)
router.delete(
  "/storie/:name/:storieId",
  checkTokenMW,
  checkAdminMW,
  deleteBannedStorie
)

module.exports = router
