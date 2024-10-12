const getTaskById = require("../../../../api/services/day/tasks/getTaskById")
const { parse, isValid } = require("date-fns")
const {
  day: {
    task: { maxTitleLength },
  },
} = require("../../../../constants/index")

const editTaskValidation = async (req, res, next) => {
  const { taskId } = req.params
  const { title, value, date } = req.body

  // Validations
  if (title && title?.length > maxTitleLength)
    return res.status(413).json({ message: "Task Title is too long" })
  if (value && value != true && value != false)
    return res.status(400).json({ message: "Task Value is invalid" })

  const parsedDate = parse(date, "dd-MM-yyyy", new Date())
  if (date && (!/^\d{2}-\d{2}-\d{4}$/.test(date) || !isValid(parsedDate)))
    return res.status(400).json({ message: "The Date is Invalid" })

  try {
    const task = await getTaskById({ taskId })
    if (!task) return res.status(404).json({ message: "Task not Found" })

    return next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = editTaskValidation
