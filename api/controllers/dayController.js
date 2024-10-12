// Events
const createEvent = require("../services/day/events/createEvent")
const editEvent = require("../services/day/events/editEvent")
const deleteEvent = require("../services/day/events/deleteEvent")
const getEventById = require("../services/day/events/getEventById")
const searchEvents = require("../services/day/events/searchEvents")

// Notes
const createNote = require("../services/day/notes/createNote")
const editNote = require("../services/day/notes/editNote")
const deleteNote = require("../services/day/notes/deleteNote")
const getNoteById = require("../services/day/notes/getNoteById")
const searchNotes = require("../services/day/notes/searchNotes")

// ========== EVENT CONTROLLERS ==========
const createEventController = async (req, res) => {
  try {
    const { code, message, event } = await createEvent({
      ...req.body,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, event })
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
const getEventByIdController = async (req, res) => {
  try {
    const { code, message, event } = await getEventById({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, event })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const searchEventsController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await searchEvents({
      ...req.params,
      ...req.query,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
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
const getNoteByIdController = async (req, res) => {
  try {
    const { code, message, note } = await getNoteById({
      ...req.params,
      loggedUser: req.user,
    })

    return res.status(code).json({ message, note })
  } catch (error) {
    return res.status(500).json({ error })
  }
}
const searchNotesController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await searchNotes({
      ...req.params,
      ...req.query,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
}

module.exports = {
  createEvent: createEventController,
  editEvent: editEventController,
  deleteEvent: deleteEventController,
  getEventById: getEventByIdController,
  searchEvents: searchEventsController,

  createNote: createNoteController,
  editNote: editNoteController,
  deleteNote: deleteNoteController,
  getNoteById: getNoteByIdController,
  searchNotes: searchNotesController,
}
