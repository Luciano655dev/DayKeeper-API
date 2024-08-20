const express = require("express")
const router = express.Router()
const passport = require("passport")
const passportConfig = require("../api/config/passportAuth")
const {
  register,
  userData,
  confirmEmail,
  forgetPassword,
  resetPassword,
} = require("../api/controllers/authController")

// Middlewares
const userRegisterValidation = require("../middlewares/validations/auth/userRegisterValidation")
const userLoginValidation = require("../middlewares/validations/auth/userLoginValidation")
const checkTokenMW = require("../middlewares/checkTokenMW")

passportConfig(passport)

// Routes
router.post("/register", userRegisterValidation, register)
router.get("/confirm_email", confirmEmail)
router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetPassword)
router.get("/user", checkTokenMW, userData)

// passport
router.post(
  "/login",
  userLoginValidation,
  passport.authenticate("local", {
    successRedirect: "/auth/user",
    failureRedirect: "/",
    failureFlash: true,
  })
)

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/user",
    failureRedirect: "/",
    failureFlash: true,
  })
)

router.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.log(`error`)
        return
      }

      console.log(`deslogado`)
      res.redirect("/")
    })
  } catch {
    return res.status(400).json({ message: `nao tem nenhum usuario logado` })
  }
})

module.exports = router
