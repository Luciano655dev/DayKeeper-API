const express = require("express")
const router = express.Router()
const {
  getUserDay,

  createEvent,
  editEvent,
  deleteEvent,
  getEvent,

  createNote,
  editNote,
  deleteNote,
  getNote,

  createTask,
  editTask,
  deleteTask,
  getTask,
  getDailyTasks,
} = require("../api/controllers/dayController")

// Middlewares
const checkTokenMW = require("../middlewares/checkTokenMW")
const createEventValidation = require("../middlewares/validations/day/events/createEventValidation")
const editEventValidation = require("../middlewares/validations/day/events/editEventValidation")
const createNoteValidation = require("../middlewares/validations/day/notes/createNoteValidation")
const editNoteValidation = require("../middlewares/validations/day/notes/editNoteValidation")
const createTaskValidation = require("../middlewares/validations/day/tasks/createTaskValidation")
const editTaskValidation = require("../middlewares/validations/day/tasks/editTaskValidation")

// Event Router
router.post("/event", checkTokenMW, createEventValidation, createEvent)
router.put("/event/:eventId", checkTokenMW, editEventValidation, editEvent)
router.delete("/event/:eventId", checkTokenMW, deleteEvent)
router.get("/event/:eventId", checkTokenMW, getEvent)

// Note Router
router.post("/note", checkTokenMW, createNoteValidation, createNote)
router.put("/note/:noteId", checkTokenMW, editNoteValidation, editNote)
router.delete("/note/:noteId", checkTokenMW, deleteNote)
router.get("/note/:noteId", checkTokenMW, getNote)

// Task Router
router.post("/task", checkTokenMW, createTaskValidation, createTask)
router.put("/task/:taskId", checkTokenMW, editTaskValidation, editTask)
router.delete("/task/:taskId", checkTokenMW, deleteTask)
router.get("/task/:taskId", checkTokenMW, getTask)

// Daily Tasks (templates)
router.get(
  "/dailyTasks",
  checkTokenMW,
  (req, res, next) => {
    req.params.name = req.user.name
    return next()
  },
  getDailyTasks
)
router.get("/:name/dailyTasks", checkTokenMW, getDailyTasks)

// Routes (/day)
router.get("/:name", checkTokenMW, getUserDay)

module.exports = router
