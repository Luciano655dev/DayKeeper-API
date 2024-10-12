const convertTimeZone = require(`../../../utils/convertTimeZone`)
const DayNote = require("../../../models/DayNote")

const {
  user: { defaultTimeZone },
  success: { created },
} = require("../../../../constants/index")

const createNote = async (props) => {
  const { date, text, loggedUser } = props

  try {
    const timeZone = loggedUser?.timeZone || defaultTimeZone

    const newNote = new DayNote({
      text,
      date,
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
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = createNote
