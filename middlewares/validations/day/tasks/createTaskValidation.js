const { parse, isValid } = require("date-fns")

const {
  day: {
    task: { maxTitleLength },
  },
} = require("../../../../constants/index")

const createTaskValidation = async (req, res, next) => {
  const { title, value, date } = req.body

  // Validations
  if (title?.length > maxTitleLength)
    return res.status(413).json({ message: "Task Title is too long" })
  if (value != true && value != false)
    return res.status(400).json({ message: "Task Value is invalid" })

  const parsedDate = parse(date, "dd-MM-yyyy", new Date())
  if (!/^\d{2}-\d{2}-\d{4}$/.test(date) || !isValid(parsedDate))
    return res.status(400).json({ message: "The Date is Invalid" })

  return next()
}

module.exports = createTaskValidation
