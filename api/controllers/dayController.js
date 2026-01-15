// Events
const createEvent = require("../services/day/events/createEvent")
const editEvent = require("../services/day/events/editEvent")
const deleteEvent = require("../services/day/events/deleteEvent")
const getEvent = require("../services/day/events/getEvent")
const getEventByDate = require("../services/day/events/getEventByDate")

// Notes
const createNote = require("../services/day/notes/createNote")
const editNote = require("../services/day/notes/editNote")
const deleteNote = require("../services/day/notes/deleteNote")
const getNote = require("../services/day/notes/getNote")
const getNotesByDate = require("../services/day/notes/getNotesByDate")

// Tasks
const createTask = require("../services/day/tasks/createTask")
const editTask = require("../services/day/tasks/editTask")
const deleteTask = require("../services/day/tasks/deleteTask")
const getTask = require("../services/day/tasks/getTask")
const getDailyTasks = require("../services/day/tasks/getDailyTasks")
const getTasksByDate = require("../services/day/tasks/getTasksByDate")

// ========== EVENT CONTROLLERS ==========
const createEventController = async (req, res) => {
  try {
    const { code, message, data } = await createEvent({
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, data })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const editEventController = async (req, res) => {
  try {
    const { code, message, event } = await editEvent({
      ...req.params,
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, event })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const deleteEventController = async (req, res) => {
  try {
    const { code, message, event } = await deleteEvent({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, event })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const getEventController = async (req, res) => {
  try {
    const { code, message, data } = await getEvent({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, data })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const getEventByDateController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const maxPageSize = req.query.maxPageSize
      ? Number(req.query.maxPageSize) <= 100
        ? Number(req.query.maxPageSize)
        : 100
      : 1
    const order = req.query.order || "relevant"
    const { username, date } = req.params

    const { code, message, props } = await getEventByDate({
      username,
      dateStr: date,
      order,
      maxPageSize,
      page,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, ...props })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

// ========== NOTE CONTROLLERS ==========
const createNoteController = async (req, res) => {
  try {
    const { code, message, note } = await createNote({
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, note })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const editNoteController = async (req, res) => {
  try {
    const { code, message, note } = await editNote({
      ...req.params,
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, note })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const deleteNoteController = async (req, res) => {
  try {
    const { code, message, note } = await deleteNote({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, note })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const getNoteController = async (req, res) => {
  try {
    const { code, message, data } = await getNote({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, data })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const getNotesByDateController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const maxPageSize = req.query.maxPageSize
      ? Number(req.query.maxPageSize) <= 100
        ? Number(req.query.maxPageSize)
        : 100
      : 1
    const order = req.query.order || "relevant"
    const { username, date } = req.params

    const { code, message, props } = await getNotesByDate({
      username,
      dateStr: date,
      order,
      maxPageSize,
      page,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, ...props })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

// ========== Task CONTROLLERS ==========
const createTaskController = async (req, res) => {
  try {
    const { code, message, task } = await createTask({
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, task })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const editTaskController = async (req, res) => {
  try {
    const { code, message, task } = await editTask({
      ...req.params,
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, task })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const deleteTaskController = async (req, res) => {
  try {
    const { code, message, task } = await deleteTask({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, task })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const getTaskController = async (req, res) => {
  try {
    const { code, message, data } = await getTask({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, data })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const getDailyTasksController = async (req, res) => {
  try {
    const username = req.params.username

    // sanitize paging
    const page = req.query?.page || 1
    const maxPageSize = req.query?.maxPageSize || 10

    const result = await getDailyTasks({
      username,
      page,
      maxPageSize,
      loggedUser: req.user,
    })

    // keep your result format
    return res.status(result.code || 200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
const getTasksByDateController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const maxPageSize = req.query.maxPageSize
      ? Number(req.query.maxPageSize) <= 100
        ? Number(req.query.maxPageSize)
        : 100
      : 1
    const order = req.query.order || "relevant"
    const { username, date } = req.params

    const { code, message, props } = await getTasksByDate({
      username,
      dateStr: date,
      order,
      maxPageSize,
      page,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, ...props })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

module.exports = {
  createEvent: createEventController,
  editEvent: editEventController,
  deleteEvent: deleteEventController,
  getEvent: getEventController,
  getEventByDate: getEventByDateController,

  createNote: createNoteController,
  editNote: editNoteController,
  deleteNote: deleteNoteController,
  getNote: getNoteController,
  getNotesByDate: getNotesByDateController,

  createTask: createTaskController,
  editTask: editTaskController,
  deleteTask: deleteTaskController,
  getTask: getTaskController,
  getDailyTasks: getDailyTasksController,
  getTasksByDate: getTasksByDateController,
}
