const express = require("express")
const router = express.Router()
const {
  getQuestion,
  getTodayQuestion,
} = require("../api/controllers/dailyQuestionController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")

// Routes
router.get("/", checkTokenMW, getTodayQuestion)
router.get("/:date", checkTokenMW, getQuestion)

module.exports = router
