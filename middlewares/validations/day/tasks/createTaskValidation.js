const { parse, isValid } = require("date-fns")

const {
  day: {
    task: { maxTitleLength },
  },
} = require("../../../../constants/index")

const createTaskValidation = async (req, res, next) => {
  const { title, value, privacy } = req.body

  // Validations
  if (title?.length > maxTitleLength)
    return res.status(413).json({ message: "Task Title is too long" })

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

module.exports = createTaskValidation
