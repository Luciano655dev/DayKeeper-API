const getNoteById = require("../../../../api/services/day/notes/getNoteById")
const { parse, isValid } = require("date-fns")
const {
  day: {
    note: { maxNoteLength },
  },
} = require("../../../../constants/index")

const editNoteValidation = async (req, res, next) => {
  const { noteId } = req.params
  const { text, date } = req.body

  // Validations
  if (text && text?.length > maxNoteLength)
    return res.status(413).json({ message: "Note is too long" })

  const parsedDate = parse(date, "dd-MM-yyyy", new Date())
  if (date && (!/^\d{2}-\d{2}-\d{4}$/.test(date) || !isValid(parsedDate)))
    return res.status(400).json({ message: "The Date is Invalid" })

  try {
    const note = await getNoteById({ noteId })
    if (!note) return res.status(404).json({ message: "Note not Found" })

    return next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = editNoteValidation
