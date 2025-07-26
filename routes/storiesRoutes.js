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
  getUserStoriesFeed,
  reportStorie,
} = require("../api/controllers/storiesController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const detectInappropriateFileMW = require("../middlewares/detectInappropriateFileMW")
const createMediaDocsMW = require("../middlewares/createMediaDocsMW")

// Multer
const multer = require("multer")
const multerConfig = require("../api/config/multer")
const handleMulterError = require("../middlewares/handleMulterError")

// Routes
router.get("/", checkTokenMW, getUserStoriesFeed) // get Main Stories Feed
router.get("/:name", checkTokenMW, getTodayStories) // get today user stories
router.get("/:name/all", checkTokenMW, getUserStories) // get All User Stories
router.get("/:storieId/likes", checkTokenMW, getStorieLikes) // Get Storie Likes
router.get("/:storieId/views", checkTokenMW, getStorieViews) // Get Storie Views
router.get("/get/:storieId", checkTokenMW, getStorie) // get Storie

router.post(
  "/create",
  checkTokenMW,
  multer(multerConfig("both")).single(`file`),
  handleMulterError,
  createMediaDocsMW,
  detectInappropriateFileMW,
  createStorie
) // createStories
router.post("/:storieId/like", checkTokenMW, likeStorie) // like a storie
router.delete("/:storieId", checkTokenMW, deleteStorie) // delete a storie
router.post(`/:storieId/report`, checkTokenMW, reportStorie) // report storie

module.exports = router
