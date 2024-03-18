const express = require('express')
const router = express.Router()
const {
    getQuestion
} = require('../controllers/dailyQuestionController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')

// Routes
router.get("/:date", checkTokenMW, getQuestion)

module.exports = router