const express = require('express')
const router = express.Router()
const {
    banOrUnbanUser,
    deleteBannedUser,
    deleteUserReport
} = require('../controllers/adminController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')
const checkAdminMW = require('../middlewares/checkAdminMW')

// Routes
router.post("/:name/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanUser)
router.delete("/:name/delete", checkTokenMW, checkAdminMW, deleteBannedUser)
router.delete("/:name/:reportId", checkTokenMW, checkAdminMW, deleteUserReport)

module.exports = router
