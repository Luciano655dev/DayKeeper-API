const { isValid } = require("date-fns")
const {
  day: {
    note: { maxNoteLength },
  },
} = require("../../../../constants/index")

const createNoteValidation = async (req, res, next) => {
  const { text, privacy } = req.body

  // Validations
  if (text?.length > maxNoteLength)
    return res.status(413).json({ message: "Note is too long" })

  const date = req.body.date ? new Date(req.body.date) : null
  if (!date || !isValid(date))
    return res.status(400).json({ message: "Date is Invalid" })

  // Privacy
  switch (privacy) {
    case "public":
    case "private":
    case "close friends":
    case undefined:
      break
    default:
      return res.status(404).json({ message: "Invalid privacy value" })
  }

  return next()
}

module.exports = createNoteValidation
