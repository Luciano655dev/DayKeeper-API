const express = require('express')
const router = express.Router()
const {
    register,
    login,
    userData,
    confirmEmail,
    forgetPassword,
    resetPassword
} = require('../controllers/authController')

// Middlewares
const userValidation = require('../middlewares/validations/userValidation')
const checkTokenMW = require('../middlewares/checkTokenMW')

// Routes
router.post("/register", userValidation, register)
router.post("/login", login)
router.get("/confirm_email", confirmEmail)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)
router.get('/user', checkTokenMW, userData)

module.exports = router
