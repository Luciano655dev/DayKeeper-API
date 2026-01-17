const mongoose = require("mongoose")

const deleteTaskDoc = require("./delete/deleteTasks")

const {
  errors: { notFound, invalidValue },
  success: { deleted },
} = require("../../../../constants/index")

const deleteTask = async (props) => {
  const { taskId } = props || {}

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    return invalidValue("Task ID")
  }

  const changed = await deleteTaskDoc(taskId)

  if (!changed) return notFound("Task")

  return deleted("Day Task")
}

module.exports = deleteTask
