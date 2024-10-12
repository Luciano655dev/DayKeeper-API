const express = require("express")
const router = express.Router()
const {
  createEvent,
  editEvent,
  deleteEvent,
  getEventById,
  searchEvents,
} = require("../api/controllers/dayController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const createEventValidation = require("../middlewares/validations/day/events/createEventValidation")
const editEventValidation = require("../middlewares/validations/day/events/editEventValidation")

// Routes (/day)

// Event Router
router.post("/event", checkTokenMW, createEventValidation, createEvent)
router.put("/event/:eventId", checkTokenMW, editEventValidation, editEvent)
router.delete("/event/:eventId", checkTokenMW, deleteEvent)
router.get("/event/:eventId", checkTokenMW, getEventById)
router.get("/event/search/:userId", checkTokenMW, searchEvents)

module.exports = router
