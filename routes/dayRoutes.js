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

  createTask,
  editTask,
  deleteTask,
  getTaskById,
  searchTasks,
} = require("../api/controllers/dayController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const checkElementPrivacy = require("../middlewares/checkElementPrivacyMW")
const createEventValidation = require("../middlewares/validations/day/events/createEventValidation")
const editEventValidation = require("../middlewares/validations/day/events/editEventValidation")
const createNoteValidation = require("../middlewares/validations/day/notes/createNoteValidation")
const editNoteValidation = require("../middlewares/validations/day/notes/editNoteValidation")
const createTaskValidation = require("../middlewares/validations/day/tasks/createTaskValidation")
const editTaskValidation = require("../middlewares/validations/day/tasks/editTaskValidation")

// Get Validations
const checkValidUserMW = require("../middlewares/checkValidUserMW")

// Routes (/day)

// Event Router
router.post("/event", checkTokenMW, createEventValidation, createEvent)
router.put("/event/:eventId", checkTokenMW, editEventValidation, editEvent)
router.delete("/event/:eventId", checkTokenMW, deleteEvent)
router.get("/event/search/:userId", checkTokenMW, searchEvents)
router.get(
  "/event/:name/:eventId",
  checkTokenMW,
  checkValidUserMW,
  checkElementPrivacy("event"),
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
  checkValidUserMW,
  checkElementPrivacy("note"),
  getNoteById
)

// Task Router
router.post("/task", checkTokenMW, createTaskValidation, createTask)
router.put("/task/:taskId", checkTokenMW, editTaskValidation, editTask)
router.delete("/task/:taskId", checkTokenMW, deleteTask)
router.get("/task/search/:userId", checkTokenMW, searchTasks)
router.get(
  "/task/:name/:taskId",
  checkTokenMW,
  checkValidUserMW,
  checkElementPrivacy("task"),
  getTaskById
)

module.exports = router
