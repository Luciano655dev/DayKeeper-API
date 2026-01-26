const express = require("express")
const router = express.Router()

const checkTokenMW = require("../middlewares/checkTokenMW")
const {
  getDeviceSessions,
  revokeDeviceSession,
  revokeAllDeviceSessions,
} = require("../api/controllers/deviceSessionController")

router.get("/", checkTokenMW, getDeviceSessions)
router.delete("/", checkTokenMW, revokeAllDeviceSessions)
router.delete("/:id", checkTokenMW, revokeDeviceSession)

module.exports = router
