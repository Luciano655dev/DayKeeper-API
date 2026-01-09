const express = require("express")
const router = express.Router()

const { search, feed } = require("../api/controllers/searchController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")

// Routes
router.get("/", checkTokenMW, feed)
router.get("/search", checkTokenMW, search)

module.exports = router
