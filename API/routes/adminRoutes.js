const express = require('express')
const router = express.Router()
const {
    getReportedUsers,
    getBannedUsers,
    banOrUnbanUser,
    deleteBannedUser,
    deleteUserReport
} = require('../controllers/adminController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')
const checkAdminMW = require('../middlewares/checkAdminMW')

// Routes
router.get("/reportedUsers", checkTokenMW, checkAdminMW, getReportedUsers)
router.get("/bannedUsers", checkTokenMW, checkAdminMW, getBannedUsers)
router.post("/:name/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanUser)
router.delete("/:name/delete", checkTokenMW, checkAdminMW, deleteBannedUser)
router.delete("/:name/:reportId", checkTokenMW, checkAdminMW, deleteUserReport)

module.exports = router
