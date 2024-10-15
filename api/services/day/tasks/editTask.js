const DayTask = require("../../../models/DayTask")

const {
  success: { updated },
} = require("../../../../constants/index")

const editTask = async (props) => {
  const {
    taskId,

    value,
    title,
    date,
    privacy,
    loggedUser,
  } = props

  try {
    const updateData = {
      ...(title && { title }),
      ...(value && { value }),
      ...(date && { date }),
      ...(privacy && { privacy }),
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
