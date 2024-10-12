const { parse, isValid } = require("date-fns")
const {
  day: {
    note: { maxNoteLength },
  },
} = require("../../../../constants/index")

const createNoteValidation = async (req, res, next) => {
  const { text, date } = req.body

  // Validations
  if (text?.length > maxNoteLength)
    return res.status(413).json({ message: "Note is too long" })

  const parsedDate = parse(date, "dd-MM-yyyy", new Date())
  if (!/^\d{2}-\d{2}-\d{4}$/.test(date) || !isValid(parsedDate))
    return res.status(400).json({ message: "The Date is Invalid" })

  return next()
}

module.exports = createNoteValidation
