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
const userRegisterValidation = require('../middlewares/validations/auth/userRegisterValidation')
const userLoginValidation = require('../middlewares/validations/auth/userLoginValidation')
const checkTokenMW = require('../middlewares/checkTokenMW')

// Routes
router.post("/register", userRegisterValidation, register)
router.post("/login", userLoginValidation, login)
router.get("/confirm_email", confirmEmail)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)
router.get('/user', checkTokenMW, userData)

module.exports = router
