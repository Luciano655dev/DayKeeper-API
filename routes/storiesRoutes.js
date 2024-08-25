const express = require("express")
const router = express.Router()

const {
  getUserStories,
  getTodayStories,
  getStorie,
  createStorie,
  reactStorie,
  deleteStorie,
  reportStorie,
} = require("../api/controllers/storiesController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const checkBannedUserMW = require(`../middlewares/checkBannedUserMW`)
const checkPrivateUserMW = require(`../middlewares/checkPrivateUserMW`)
const verifyStoriesOwnershipMW = require("../middlewares/verifyStoriesOwnership")

// Multer
const multer = require("multer")
const multerConfig = require("../api/config/multer")
const handleMulterError = require("../middlewares/handleMulterError")

const detectInappropriateFileMW = require("../middlewares/detectInappropriateFileMW")

// Routes
router.get(
  "/:name",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  getTodayStories
) // get today user stories
router.get(
  "/:name/all",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  getUserStories
) // get user stories
router.get(
  "/:name/:storieTitle",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  getStorie
) // get today user stories

router.post(
  "/create",
  checkTokenMW,
  multer(multerConfig("both")).single(`file`),
  detectInappropriateFileMW,
  handleMulterError,
  createStorie
) // createStories
router.post(
  "/:name/:storieTitle",
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  reactStorie
) // react to a storie
router.delete(
  "/:storieId",
  checkTokenMW,
  verifyStoriesOwnershipMW,
  deleteStorie
) // delete a storie
router.post(
  `/:name/:storieTitle/report`,
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  reportStorie
) // report storie

module.exports = router
