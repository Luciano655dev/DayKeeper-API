const DayTask = require("../../../models/DayTask")
const convertTimeZone = require(`../../../utils/convertTimeZone`)

const {
  day: {
    task: { maxTitleLength },
  },
  user: { defaultTimeZone },
  errors: { inputTooLong },
  success: { created },
} = require("../../../../constants/index")

const createTask = async (props) => {
  const { date, title, value, loggedUser } = props

  if (title?.length > maxTitleLength) return inputTooLong("Task Title")
  const parsedDate = parse(date, "dd-MM-yyyy", new Date())
  if (!isValid(parsedDate)) {
    throw new Error("Invalid date format. Please use 'dd-MM-yyyy'.")
  }

  try {
    const timeZone = loggedUser?.timeZone || defaultTimeZone

    const newTask = new DayTask({
      date,
      value,
      title,
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
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = createTask
