const DayTask = require("../../../models/DayTask")
const mongoose = require("mongoose")

const {
  day: {
    task: { maxTitleLength },
  },
  errors: { invalidValue, inputTooLong },
  success: { updated },
} = require("../../../../constants/index")

const editTask = async (props) => {
  const {
    taskId,

    value,
    title,
    date,
    loggedUser,
  } = props

  if (title && title?.length > maxTitleLength) inputTooLong("Task Title")

  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) return invalidValue("Task ID")

    const updateData = {
      ...(title && { title }),
      ...(value && { value }),
      ...(date && { date }),
      user: loggedUser._id,
    }

    await DayTask.findByIdAndUpdate(
      taskId,
      {
        $set: updateData,
      },
      { new: true }
    )

    return updated(`Day Task`)
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = editTask
