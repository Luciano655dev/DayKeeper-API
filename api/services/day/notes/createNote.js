const convertTimeZone = require(`../../../utils/convertTimeZone`)
const DayNote = require("../../../models/DayNote")

const {
  user: { defaultTimeZone },
  success: { created },
} = require("../../../../constants/index")

const createNote = async (props) => {
  const { date, text, privacy, loggedUser } = props

  try {
    const timeZone = loggedUser?.timeZone || defaultTimeZone

    const newNote = new DayNote({
      text,
      date,
      privacy,
      user: loggedUser._id,
    })

    await newNote.save()

    return created(`Day Note`, {
      note: {
        ...newNote._doc,
        created_at: convertTimeZone(new Date(), timeZone),
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = createNote
