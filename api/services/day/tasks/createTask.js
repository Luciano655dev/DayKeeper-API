const { parseISO, isValid } = require("date-fns")
const DayTask = require("../../../models/DayTask")
const convertTimeZone = require("../../../utils/convertTimeZone")

const {
  user: { defaultTimeZone },
  errors: { invalidValue },
  success: { created },
} = require("../../../../constants/index")

const createTask = async (props) => {
  const {
    date,
    title,
    completed = false,
    privacy,
    loggedUser,
    daily = false, // template or normal task
  } = props || {}

  const timeZone = loggedUser?.timeZone || defaultTimeZone

  // ---------- DAILY TEMPLATE ----------
  if (daily === true) {
    try {
      const task = await DayTask.create({
        title: title.trim(),
        completed: false,
        privacy,
        user: loggedUser._id,
        daily: true,
        // no date
      })

      const obj = task.toObject()

      return created("Daily Task", {
        data: {
          ...obj,
          created_at: convertTimeZone(
            obj.createdAt || task.created_at,
            timeZone
          ),
        },
      })
    } catch (error) {
      throw error
    }
  }

  // ---------- NORMAL DAY TASK ----------
  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date)

  try {
    const task = await DayTask.create({
      title: title.trim(),
      date: parsedDate,
      completed,
      privacy,
      user: loggedUser._id,
      daily: false,
      status: "public",
    })

    const obj = task.toObject()

    return created("Day Task", {
      data: {
        ...obj,
        created_at: convertTimeZone(
          obj.createdAt || obj?.created_at || Date.now(),
          timeZone
        ),
      },
    })
  } catch (error) {
    throw error
  }
}

module.exports = createTask
