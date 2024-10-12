const DayTask = require("../../../models/DayTask")
const getTaskById = require("./getTaskById")

const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../../constants/index")

const deleteTask = async (props) => {
  const { taskId, loggedUser } = props

  try {
    const task = await getTaskById({ taskId })
    if (!task) return notFound("Task")

    if (!task.task.user.equals(loggedUser._id))
      return unauthorized(
        "You can't delete this task",
        "only the person who creted this task can delete it"
      )

    await DayTask.findOneAndDelete({ _id: taskId })

    return deleted(`Day Task`)
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = deleteTask
