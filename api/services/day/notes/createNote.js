const { parseISO, isValid } = require("date-fns")
const convertTimeZone = require("../../../utils/convertTimeZone")
const DayNote = require("../../../models/DayNote")

const {
  user: { defaultTimeZone },
  errors: { invalidValue, unauthorized },
  success: { created },
} = require("../../../../constants/index")

const createNote = async (props) => {
  const { date, text, privacy, loggedUser } = props || {}

  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (typeof text !== "string" || text.trim().length < 1) {
    return invalidValue("Text")
  }

  if (!date) {
    return invalidValue("Date")
  }

  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date)
  if (!isValid(parsedDate)) {
    return invalidValue("Date")
  }

  const timeZone = loggedUser?.timeZone || defaultTimeZone

  try {
    const newNote = await DayNote.create({
      text: text.trim(),
      date: parsedDate,
      privacy,
      user: loggedUser._id,
    })

    const obj = newNote.toObject()

    return created("Day Note", {
      data: {
        ...obj,
        created_at: convertTimeZone(
          obj.createdAt || obj.created_at || newNote.created_at,
          timeZone
        ),
      },
    })
  } catch (error) {
    throw error
  }
}

module.exports = createNote
