const DayTask = require("../../../models/DayTask")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const mongoose = require("mongoose")

const {
  user: { defaultTimeZone },
  errors: { invalidValue, notFound },
  success: { fetched },
} = require("../../../../constants/index")

const getTaskById = async (props) => {
  const { taskId, loggedUser } = props
  const timeZone = loggedUser?.timeZone || defaultTimeZone

  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) return invalidValue("Task ID")

    const task = await DayTask.findOne({ _id: taskId })
    if (!task) return notFound("Task")

    return fetched(`Day Task`, {
      task: {
        ...task._doc,
        created_at: convertTimeZone(task.created_at, timeZone),
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getTaskById
