const getTask = require("../../../../api/services/day/tasks/getTask")
const mongoose = require("mongoose")
const { isValid } = require("date-fns")
const {
  day: {
    task: { maxTitleLength },
  },
} = require("../../../../constants/index")

const editTaskValidation = async (req, res, next) => {
  const { taskId } = req.params
  const { title, value, privacy } = req.body

  // Validations
  if (title && title?.length > maxTitleLength)
    return res.status(413).json({ message: "Task Title is too long" })
  if (value && value != true && value != false)
    return res.status(400).json({ message: "Task Value is invalid" })

  const date = req.body.date ? new Date(req.body.date) : null
  if (date && !isValid(date))
    return res.status(400).json({ message: "Date is Invalid" })

  if (!mongoose.Types.ObjectId.isValid(taskId))
    return res.status(400).json({ message: "The Task ID is Invalid" })

  // Privacy
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
    const task = await getTask({ taskId, loggedUser: req.user })
    if (task.code != 200)
      return res.status(404).json({ message: "Task not Found" })

    return next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = editTaskValidation
