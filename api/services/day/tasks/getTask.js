const DayTask = require("../../../models/DayTask")
const getTaskPipeline = require("../../../repositories/pipelines/day/tasks/getTaskPipeline")
const mongoose = require("mongoose")

const {
  errors: { invalidValue, notFound },
  success: { fetched },
} = require("../../../../constants/index")

const getTask = async ({ taskId, loggedUser }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) return invalidValue("Task ID")

    const task = await DayTask.aggregate(getTaskPipeline(taskId, loggedUser))
    if (!task || task?.length == 0) return notFound("Task")

    return fetched("task", { data: task[0] })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = getTask
