const getNote = require("../../../../api/services/day/notes/getNote")
const { isValid } = require("date-fns")
const {
  day: {
    note: { maxNoteLength },
  },
} = require("../../../../constants/index")

const editNoteValidation = async (req, res, next) => {
  const { noteId } = req.params
  const { text, privacy } = req.body

  // Validations
  if (text && text?.length > maxNoteLength)
    return res.status(413).json({ message: "Note is too long" })

  const date = req.body.date ? new Date(req.body.date) : null
  if (date && !isValid(date))
    return res.status(400).json({ message: "Date is Invalid" })

  // privacy
  if (privacy)
    switch (privacy) {
      case "public":
      case "private":
      case "close friends":
      case undefined:
        break
      default:
        return res.status(404).json({ message: "Invalid privacy value" })
    }

  try {
    const note = await getNote({ noteId, loggedUser: req.user })
    if (note.code != 200)
      return res.status(404).json({ message: "Note not Found" })

    return next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = editNoteValidation
