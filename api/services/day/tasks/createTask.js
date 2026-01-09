const { parseISO, isValid } = require("date-fns")
const DayTask = require("../../../models/DayTask")
const convertTimeZone = require("../../../utils/convertTimeZone")

const {
  user: { defaultTimeZone },
  errors: { invalidValue, unauthorized },
  success: { created },
} = require("../../../../constants/index")

const createTask = async (props) => {
  const { date, title, completed = false, privacy, loggedUser } = props || {}

  if (typeof title !== "string" || title.trim().length < 1) {
    return invalidValue("Title")
  }

  if (!date) {
    return invalidValue("Date")
  }

  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date)
  if (!isValid(parsedDate)) {
    return invalidValue("Date")
  }

  if (typeof completed !== "boolean") {
    return invalidValue("Completed")
  }

  const timeZone = loggedUser?.timeZone || defaultTimeZone

  try {
    const task = await DayTask.create({
      title: title.trim(),
      date: parsedDate,
      completed,
      privacy,
      user: loggedUser._id,
    })

    const obj = task.toObject()

    return created("Day Task", {
      data: {
        ...obj,
        created_at: convertTimeZone(obj.createdAt || task.created_at, timeZone),
      },
    })
  } catch (error) {
    throw error
  }
}

module.exports = createTask
