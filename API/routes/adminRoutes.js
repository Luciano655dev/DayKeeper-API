const express = require('express')
const router = express.Router()
const {
    banOrUnbanUser
} = require('../controllers/adminController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')
const checkAdminMW = require('../middlewares/checkAdminMW')

// Routes
router.post("/:name/banOrUnban", checkTokenMW, checkAdminMW, banOrUnbanUser)

module.exports = router
