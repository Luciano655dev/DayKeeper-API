const express = require('express')
const router = express.Router()

const {
    search
} = require('../controllers/searchController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')

// Routes
router.get('/', checkTokenMW, search)
router.get('/search', checkTokenMW, search)

module.exports = router