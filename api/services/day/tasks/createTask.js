const DayTask = require("../../../models/DayTask")
const convertTimeZone = require(`../../../utils/convertTimeZone`)

const {
  user: { defaultTimeZone },
  success: { created },
} = require("../../../../constants/index")

const createTask = async (props) => {
  const { date, title, value, privacy, loggedUser } = props

  try {
    const timeZone = loggedUser?.timeZone || defaultTimeZone

    const newTask = new DayTask({
      date,
      value,
      title,
      privacy,
      user: loggedUser._id,
    })

    await newTask.save()

    return created(`Day Task`, {
      task: {
        ...newTask._doc,
        created_at: convertTimeZone(new Date(), timeZone),
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = createTask
