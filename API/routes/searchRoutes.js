const express = require('express')
const router = express.Router()

const {
    algorithm,
    search
} = require('../controllers/searchController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')

// Routes
router.get("/", checkTokenMW, algorithm) // recent, relevant, following
router.get('/search', checkTokenMW, search)

module.exports = router