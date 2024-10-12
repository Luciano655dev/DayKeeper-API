const express = require("express")
const router = express.Router()
const {
  createEvent,
  editEvent,
  deleteEvent,
  getEventById,
  searchEvents,

  createNote,
  editNote,
  deleteNote,
  getNoteById,
  searchNotes,
} = require("../api/controllers/dayController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const createEventValidation = require("../middlewares/validations/day/events/createEventValidation")
const editEventValidation = require("../middlewares/validations/day/events/editEventValidation")
const createNoteValidation = require("../middlewares/validations/day/notes/createNoteValidation")
const editNoteValidation = require("../middlewares/validations/day/notes/editNoteValidation")

// Get Validations
const checkBannedUser = require("../middlewares/checkBannedUserMW")
const checkBlockedUser = require("../middlewares/checkBlockedUserMW")
const checkPrivateUserMW = require("../middlewares/checkPrivateUserMW")

// Routes (/day)

// Event Router
router.post("/event", checkTokenMW, createEventValidation, createEvent)
router.put("/event/:eventId", checkTokenMW, editEventValidation, editEvent)
router.delete("/event/:eventId", checkTokenMW, deleteEvent)
router.get("/event/search/:userId", checkTokenMW, searchEvents)
router.get(
  "/event/:name/:eventId",
  checkTokenMW,
  checkBannedUser,
  checkBlockedUser,
  checkPrivateUserMW,
  getEventById
)

// Note Router
router.post("/note", checkTokenMW, createNoteValidation, createNote)
router.put("/note/:noteId", checkTokenMW, editNoteValidation, editNote)
router.delete("/note/:noteId", checkTokenMW, deleteNote)
router.get("/note/search/:userId", checkTokenMW, searchNotes)
router.get(
  "/note/:name/:noteId",
  checkTokenMW,
  checkBannedUser,
  checkBlockedUser,
  checkPrivateUserMW,
  getNoteById
)

module.exports = router
