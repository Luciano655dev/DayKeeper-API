const mongoose = require("mongoose")
const DayTask = require("../../../models/DayTask")

const {
  errors: { notFound, unauthorized, invalidValue },
  success: { deleted },
} = require("../../../../constants/index")

const deleteTask = async (props) => {
  const { taskId, loggedUser } = props || {}

  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    return invalidValue("Task ID")
  }

  try {
    const doc = await DayTask.findOneAndDelete({
      _id: taskId,
      user: loggedUser._id,
    }).select("_id")

    if (!doc) return notFound("Task")

    return deleted("Day Task")
  } catch (error) {
    throw error
  }
}

module.exports = deleteTask
