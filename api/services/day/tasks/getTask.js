const mongoose = require("mongoose")
const DayTask = require("../../../models/DayTask")
const getTaskPipeline = require("../../../repositories/pipelines/day/tasks/getTaskPipeline")

const {
  errors: { invalidValue, notFound, unauthorized },
  success: { fetched },
} = require("../../../../constants/index")

const getTask = async ({ taskId, loggedUser }) => {
  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return invalidValue("Task ID")
  }

  try {
    const task = await DayTask.aggregate(getTaskPipeline(taskId, loggedUser))
    if (!task || task.length === 0) return notFound("Task")

    return fetched("task", { data: task[0] })
  } catch (error) {
    throw error
  }
}

module.exports = getTask
