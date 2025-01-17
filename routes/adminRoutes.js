const express = require("express")
const router = express.Router()
const {
  deleteReport,
  getReportedElements,
  getBannedElements,
  getBanHistoryMadeByAdmin,
  getElementBanHistory,

  banOrUnbanUser,
  deleteBannedUser,

  banOrUnbanPost,
  deleteBannedPost,

  banOrUnbanStorie,
  deleteBannedStorie,
} = require("../api/controllers/adminController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const checkAdminMW = require("../middlewares/checkAdminMW")

router.delete("/report/:reportId", checkTokenMW, checkAdminMW, deleteReport)
router.get(
  "/banHistoryByAdmin/:name", // type = 'user' || 'post' || 'storie'
  checkTokenMW,
  checkAdminMW,
  getBanHistoryMadeByAdmin
)
router.get("/reports", checkTokenMW, checkAdminMW, getReportedElements)
router.get("/bans", checkTokenMW, checkAdminMW, getBannedElements)
router.get(
  "/banHistory/:elementId",
  checkTokenMW,
  checkAdminMW,
  getElementBanHistory
)

// User
router.post("/:name", checkTokenMW, checkAdminMW, banOrUnbanUser)
router.delete("/:name", checkTokenMW, checkAdminMW, deleteBannedUser)

// Post
router.post("/post/:postId", checkTokenMW, checkAdminMW, banOrUnbanPost)
router.delete("/post/:postId", checkTokenMW, checkAdminMW, deleteBannedPost)

// Storie
router.post(
  "/storie/:name/:storieId",
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
