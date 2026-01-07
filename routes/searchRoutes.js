const express = require("express")
const router = express.Router()

const { search } = require("../api/controllers/searchController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")

// Routes
router.get("/", checkTokenMW, search) // change to feed later
router.get("/search", checkTokenMW, search)

module.exports = router
