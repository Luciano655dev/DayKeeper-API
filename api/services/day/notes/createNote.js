const { parseISO } = require("date-fns")
const convertTimeZone = require("../../../utils/convertTimeZone")
const DayNote = require("../../../models/DayNote")

const {
  user: { defaultTimeZone },
  success: { created },
} = require("../../../../constants/index")

const createNote = async (props) => {
  const { date, text, privacy, loggedUser } = props || {}

  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date)

  const timeZone = loggedUser?.timeZone || defaultTimeZone

  try {
    const newNote = await DayNote.create({
      text: text.trim(),
      date: parsedDate,
      privacy,
      user: loggedUser._id,
      status: "public",
    })

    const obj = newNote.toObject()

    return created("Day Note", {
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

module.exports = createNote
