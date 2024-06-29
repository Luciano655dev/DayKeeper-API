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
    deleteBannedPost,
    deletePostReport,

    banOrUnbanStorie,
    deleteBannedStorie,
    deleteStorieReport,
    getReportedStories,
    getBannedStories
} = require('../api/controllers/adminController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')
const checkAdminMW = require('../middlewares/checkAdminMW')

// User
router.get("/reportedUsers", checkTokenMW, checkAdminMW, getReportedUsers)
router.get("/bannedUsers", checkTokenMW, checkAdminMW, getBannedUsers)
router.post("/:name/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanUser)
router.delete("/:name/", checkTokenMW, checkAdminMW, deleteBannedUser)
router.delete("/:name/:reportId", checkTokenMW, checkAdminMW, deleteUserReport)

// Post
router.get("/reportedPosts", checkTokenMW, checkAdminMW, getReportedPosts)
router.get("/bannedPosts", checkTokenMW, checkAdminMW, getBannedPosts)
router.post("/:name/:posttitle/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanPost)
router.delete("/:name/:posttitle/", checkTokenMW, checkAdminMW, deleteBannedPost)
router.delete("/:name/:posttitle/:reportId", checkTokenMW, checkAdminMW, deletePostReport)

// Storie
router.get("/reportedStories", checkTokenMW, checkAdminMW, getReportedStories)
router.get("/bannedStories", checkTokenMW, checkAdminMW, getBannedStories)
router.post("/storie/:name/:storieId/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanStorie)
router.delete("/storie/:name/:storieId", checkTokenMW, checkAdminMW, deleteBannedStorie)
router.delete("/storie/:storieTitle/:reportId", checkTokenMW, checkAdminMW, deleteStorieReport)

module.exports = router
