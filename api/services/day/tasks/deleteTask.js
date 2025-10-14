const DayTask = require("../../../models/DayTask")
const getTask = require("./getTask")

const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../../constants/index")

const deleteTask = async (props) => {
  const { taskId, loggedUser } = props

  try {
    const task = await getTask({ taskId, loggedUser })
    if (!task || task?.code != 200) return notFound("Task")

    if (!task.data.user.equals(loggedUser._id))
      return unauthorized(
        "You can't delete this task",
        "only the person who creted this task can delete it"
      )

    await DayTask.findOneAndDelete({ _id: taskId })

    return deleted(`Day Task`)
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = deleteTask
