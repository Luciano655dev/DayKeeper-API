const express = require('express')
const router = express.Router()
const passport = require('passport')
const passportConfig = require('../api/config/passport')
const {
    register,
    login,
    userData,
    confirmEmail,
    forgetPassword,
    resetPassword
} = require('../api/controllers/authController')

// Middlewares
const userRegisterValidation = require('../middlewares/validations/auth/userRegisterValidation')
const userLoginValidation = require('../middlewares/validations/auth/userLoginValidation')
const checkTokenMW = require('../middlewares/checkTokenMW')

passportConfig(passport)

// Routes
router.post("/register", userRegisterValidation, register)
router.post("/login", userLoginValidation, login)
router.get("/confirm_email", confirmEmail)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)
router.get('/user', checkTokenMW, userData)

// passport
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log(`deu certo, bem vindo ${req.user.name}`)
        res.redirect('/')
    }
)

router.get('/logout', (req, res) => {
    req.logout(err => {
    
        if (err) {
            console.log(`error, ${err}`)
            return next(err) 
        }

        console.log(`deslogado`)
        res.redirect('/')
    })
})

module.exports = router
