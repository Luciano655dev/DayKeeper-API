const express = require("express")
const router = express.Router()
const {
  getPlacesNearby,
  getPlaceById,
  searchPlace,
} = require("../api/controllers/locationController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")

// Routes
router.get("/getPlacesNearby", checkTokenMW, getPlacesNearby)
router.get("/searchPlace", checkTokenMW, searchPlace)
router.get("/getPlaceById/:placeId", checkTokenMW, getPlaceById)

module.exports = router
