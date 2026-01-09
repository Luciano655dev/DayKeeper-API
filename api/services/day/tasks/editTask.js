const mongoose = require("mongoose")
const DayTask = require("../../../models/DayTask")
const { parseISO, isValid } = require("date-fns")

const {
  errors: { invalidValue, notFound, unauthorized },
  success: { updated },
} = require("../../../../constants/index")

const editTask = async (props) => {
  const { taskId, completed, title, date, privacy, loggedUser } = props || {}

  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    return invalidValue("Task ID")
  }

  try {
    const updateData = {}

    if (Object.prototype.hasOwnProperty.call(props, "title"))
      updateData.title = title
    if (Object.prototype.hasOwnProperty.call(props, "completed"))
      updateData.completed = completed
    if (Object.prototype.hasOwnProperty.call(props, "date"))
      updateData.date = date
    if (Object.prototype.hasOwnProperty.call(props, "privacy"))
      updateData.privacy = privacy
    if (Object.prototype.hasOwnProperty.call(props, "date")) {
      // parse ISO
      const d = typeof date === "string" ? parseISO(date) : new Date(date)
      if (!isValid(d)) return invalidValue("Date")
      updateData.date = d
    }

    if (Object.keys(updateData).length === 0) {
      return invalidValue("No fields to update")
    }

    if (
      Object.prototype.hasOwnProperty.call(updateData, "completed") &&
      typeof updateData.completed !== "boolean"
    ) {
      return invalidValue("Completed")
    }

    const doc = await DayTask.findOneAndUpdate(
      { _id: taskId, user: loggedUser._id },
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!doc) return notFound("Task")

    return updated("Task", { data: doc })
  } catch (error) {
    throw error
  }
}

module.exports = editTask
