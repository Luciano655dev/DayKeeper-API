const express = require("express")
const bodyParser = require("body-parser")
const router = express.Router()
const {
  handleRekognition,
  getJobStatus,
} = require("../api/controllers/webhooksController")

// middleware
const checkTokenMW = require("../middlewares/checkTokenMW")

router.post("/rekognition", bodyParser.text({ type: "*/*" }), handleRekognition)

router.get("/rekognition/status/:jobId", checkTokenMW, getJobStatus)

module.exports = router
