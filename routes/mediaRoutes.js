const express = require("express")
const router = express.Router()

const { getMediaById } = require("../api/controllers/mediaController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")

// Routes
router.get("/:mediaId", checkTokenMW, getMediaById)

module.exports = router
