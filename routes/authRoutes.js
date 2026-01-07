const express = require("express")
const router = express.Router()
const passport = require("passport")
const passportConfig = require("../api/config/passportAuth")

const {
  login,
  register,
  refresh,
  logout,
  userData,
  confirmEmail,
  resendCode,
  forgetPassword,
  resetPassword,
} = require("../api/controllers/authController")

const userRegisterValidation = require("../middlewares/validations/auth/userRegisterValidation")
const userLoginValidation = require("../middlewares/validations/auth/userLoginValidation")
const checkTokenMW = require("../middlewares/checkTokenMW")

passportConfig(passport)

router.post("/register", userRegisterValidation, register)
router.post("/confirm_email", confirmEmail)
router.post("/forget_password", forgetPassword)
router.post("/reset_password", resetPassword)
router.post("/resend_code", resendCode)

router.get("/user", checkTokenMW, userData)

router.post(
  "/login",
  userLoginValidation,
  passport.authenticate("local"),
  login
)

router.post("/refresh", refresh)
router.post("/logout", logout)

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
)

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const {
      signAccessToken,
      makeRefreshToken,
      storeRefreshToken,
    } = require("../api/utils/tokens")

    const accessToken = signAccessToken(req.user)
    const refreshToken = makeRefreshToken()

    await storeRefreshToken({
      userId: req.user._id,
      refreshToken,
      deviceId: null,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    })

    return res.status(200).json({
      message: "Google login success",
      accessToken,
      refreshToken,
    })
  }
)

module.exports = router
