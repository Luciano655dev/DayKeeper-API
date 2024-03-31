const express = require('express')
const router = express.Router()
const {
    getReportedUsers,
    getBannedUsers,
    banOrUnbanUser,
    deleteBannedUser,
    deleteUserReport,
    getReportedPosts,
    getBannedPosts,
    banOrUnbanPost,
    deleteBannedPost
} = require('../controllers/adminController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')
const checkAdminMW = require('../middlewares/checkAdminMW')

// User
router.get("/reportedUsers", checkTokenMW, checkAdminMW, getReportedUsers)
router.get("/bannedUsers", checkTokenMW, checkAdminMW, getBannedUsers)
router.post("/:name/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanUser)
router.delete("/:name/delete", checkTokenMW, checkAdminMW, deleteBannedUser)
router.delete("/:name/:reportId", checkTokenMW, checkAdminMW, deleteUserReport)

// Post
router.get("/reportedPosts", checkTokenMW, checkAdminMW, getReportedPosts)
router.get("/bannedPosts", checkTokenMW, checkAdminMW, getBannedPosts)
router.post("/:name/:posttitle/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanPost)
router.delete("/:name/:posttitle/delete", checkTokenMW, checkAdminMW, deleteBannedPost)

module.exports = router
