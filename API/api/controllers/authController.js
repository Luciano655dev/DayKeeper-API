const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  sendVerificationEmail,
  sendPasswordResetEmail
} = require('../utils/emailHandler')

const { serverError } = require('../../constants')

const register = require('../services/auth/register')
const login = require('../services/auth/login')
const confirmEmail = require('../services/auth/confirmEmail')
const forgetPassword = require('../services/auth/forgetPassword')
const resetPassword = require('../services/auth/resetPassword')
const getUserData = require('../services/auth/getUserData')

// register
const registerController = async(req, res) => {
  try {
    const user = await register(req.body)

    return res.status(201).json({ message: "Ative sua conta no seu Email", user })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

// login
const loginController = async(req, res)=>{
  try {
    const { token, user } = await login(req.body)

    return res.status(200).json({ message: "Authentication completed successfully", token, user })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

// verifyEmail
const confirmEmailController = async(req, res) => {
  try{
    const { code, message } = await confirmEmail(req.query)

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
    return res.status(400).json({ message: "Invalid or expired token. If this error persists, contact an admin" })
  }
}

// userData
const userDataController = async(req, res)=>{
  try {
    const { code, message, user } = await getUserData({...req.params, id: req.id})

    return res.status(code).json({ message, user })
  } catch (error) {
    return res.status(500).json({ message: serverError(error.message) })
  }
}

module.exports = {
  register: registerController,
  login: loginController,
  userData: userDataController,
  confirmEmail: confirmEmailController,
  forgetPassword: forgetPasswordController,
  resetPassword: resetPasswordController
}