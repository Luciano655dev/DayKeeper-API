const {
  errors: { serverError },
} = require("../../constants/index")

const register = require("../services/auth/register")
const confirmEmail = require("../services/auth/confirmEmail")
const forgetPassword = require("../services/auth/forgetPassword")
const resetPassword = require("../services/auth/resetPassword")
const getUserData = require("../services/auth/getUserData")

// register
const registerController = async (req, res) => {
  try {
    const { code, message, user } = await register(req.body)

    return res.status(code).json({ message, user })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

// verifyEmail
const confirmEmailController = async (req, res) => {
  try {
    const { code, message } = await confirmEmail(req.body)

    return res.status(code).json({ message })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

// forgetPassword
const forgetPasswordController = async (req, res) => {
  try {
    const { code, message } = await forgetPassword(req.body)

    return res.status(code).json({ message })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: serverError(error.message) })
  }
}

// resetPassword
const resetPasswordController = async (req, res) => {
  try {
    const { code, message } = await resetPassword({ ...req.query, ...req.body })

    return res.status(code).json({ message })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message:
        "Invalid or expired token. If this error persists, contact an admin",
    })
  }
}

// userData
const userDataController = async (req, res) => {
  try {
    const { code, message, user, token } = await getUserData({
      ...req.params,
      user: req.user,
    })

    return res.status(code).json({ message, user, token })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

module.exports = {
  register: registerController,
  userData: userDataController,
  confirmEmail: confirmEmailController,
  forgetPassword: forgetPasswordController,
  resetPassword: resetPasswordController,
}
