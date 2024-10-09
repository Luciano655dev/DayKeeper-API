const express = require("express")
const router = express.Router()

const {
  getUserStories,
  getTodayStories,
  getStorie,
  createStorie,
  deleteStorie,
  likeStorie,
  getStorieLikes,
  getStorieViews,
  reportStorie,
} = require("../api/controllers/storiesController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const checkBannedUserMW = require(`../middlewares/checkBannedUserMW`)
const checkPrivateUserMW = require(`../middlewares/checkPrivateUserMW`)
const verifyStoriesOwnershipMW = require("../middlewares/verifyStoriesOwnership")
const verifyStorieNameIdRelation = require("../middlewares/verifyStorieNameIdRelation")

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
) // get All User Stories
router.get("/:storieId/likes", checkTokenMW, getStorieLikes) // Get Storie Likes
router.get("/:storieId/views", checkTokenMW, getStorieViews) // Get Storie Views
router.get(
  "/:name/:title",
  checkTokenMW,
  verifyStorieNameIdRelation,
  checkBannedUserMW,
  checkPrivateUserMW,
  getStorie
) // get Storie

router.post(
  "/create",
  checkTokenMW,
  multer(multerConfig("both")).single(`file`),
  handleMulterError,
  detectInappropriateFileMW,
  createStorie
) // createStories
router.post(
  "/:name/:storieId/like",
  verifyStorieNameIdRelation,
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  likeStorie
) // like a storie
router.delete(
  "/:storieId",
  checkTokenMW,
  verifyStoriesOwnershipMW,
  deleteStorie
) // delete a storie
router.post(
  `/:name/:title/report`,
  checkTokenMW,
  checkBannedUserMW,
  checkPrivateUserMW,
  reportStorie
) // report storie

module.exports = router
