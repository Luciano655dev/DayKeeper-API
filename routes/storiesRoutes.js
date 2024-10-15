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
const checkValidUserMW = require("../middlewares/checkValidUserMW")
const checkBannedUserMW = require("../middlewares/checkBannedUserMW")
const checkElementPrivacy = require("../middlewares/checkElementPrivacyMW")
const verifyStoriesOwnershipMW = require("../middlewares/verifyStoriesOwnership")
const verifyStorieNameIdRelation = require("../middlewares/verifyStorieNameIdRelation")

// Multer
const multer = require("multer")
const multerConfig = require("../api/config/multer")
const handleMulterError = require("../middlewares/handleMulterError")

const detectInappropriateFileMW = require("../middlewares/detectInappropriateFileMW")
const verifyStorieOwnership = require("../middlewares/verifyStoriesOwnership")

// Routes
router.get("/:name", checkTokenMW, checkValidUserMW, getTodayStories) // get today user stories
router.get("/:name/all", checkTokenMW, checkValidUserMW, getUserStories) // get All User Stories
router.get(
  "/:storieId/likes",
  checkTokenMW,
  verifyStorieOwnership,
  getStorieLikes
) // Get Storie Likes
router.get(
  "/:storieId/views",
  checkTokenMW,
  verifyStorieOwnership,
  getStorieViews
) // Get Storie Views
router.get(
  "/:name/:title",
  checkTokenMW,
  verifyStorieNameIdRelation,
  checkValidUserMW,
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
  checkValidUserMW,
  checkElementPrivacy,
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
  reportStorie
) // report storie

module.exports = router
