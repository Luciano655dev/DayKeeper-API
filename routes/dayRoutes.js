const express = require("express")
const router = express.Router()
const {
  createEvent,
  editEvent,
  deleteEvent,
  getEvent,
  searchEvents,

  createNote,
  editNote,
  deleteNote,
  getNote,
  searchNotes,

  createTask,
  editTask,
  deleteTask,
  getTask,
  searchTasks,
} = require("../api/controllers/dayController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const createEventValidation = require("../middlewares/validations/day/events/createEventValidation")
const editEventValidation = require("../middlewares/validations/day/events/editEventValidation")
const createNoteValidation = require("../middlewares/validations/day/notes/createNoteValidation")
const editNoteValidation = require("../middlewares/validations/day/notes/editNoteValidation")
const createTaskValidation = require("../middlewares/validations/day/tasks/createTaskValidation")
const editTaskValidation = require("../middlewares/validations/day/tasks/editTaskValidation")

// Routes (/day)

// Event Router
router.post("/event", checkTokenMW, createEventValidation, createEvent)
router.put("/event/:eventId", checkTokenMW, editEventValidation, editEvent)
router.delete("/event/:eventId", checkTokenMW, deleteEvent)
router.get("/event/search", checkTokenMW, searchEvents)
router.get("/event/:eventId", checkTokenMW, getEvent)

// Note Router
router.post("/note", checkTokenMW, createNoteValidation, createNote)
router.put("/note/:noteId", checkTokenMW, editNoteValidation, editNote)
router.delete("/note/:noteId", checkTokenMW, deleteNote)
router.get("/note/search", checkTokenMW, searchNotes)
router.get("/note/:noteId", checkTokenMW, getNote)

// Task Router
router.post("/task", checkTokenMW, createTaskValidation, createTask)
router.put("/task/:taskId", checkTokenMW, editTaskValidation, editTask)
router.delete("/task/:taskId", checkTokenMW, deleteTask)
router.get("/task/search", checkTokenMW, searchTasks)
router.get("/task/:taskId", checkTokenMW, getTask)

module.exports = router
