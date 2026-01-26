const express = require("express")
const router = express.Router()

const checkTokenMW = require("../middlewares/checkTokenMW")
const {
  getNotifications,
  markNotificationsRead,
} = require("../api/controllers/notificationController")

router.get("/", checkTokenMW, getNotifications)
router.patch("/read", checkTokenMW, markNotificationsRead)

module.exports = router
