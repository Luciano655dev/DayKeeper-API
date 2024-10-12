const convertTimeZone = require(`../../../utils/convertTimeZone`)
const DayNote = require("../../../models/DayNote")
const mongoose = require("mongoose")

const {
  user: { defaultTimeZone },
  errors: { invalidValue, notFound },
  success: { fetched },
} = require("../../../../constants/index")

const getNoteById = async (props) => {
  const { noteId, loggedUser } = props
  const timeZone = loggedUser?.timeZone || defaultTimeZone

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return invalidValue("Note ID")

    const note = await DayNote.findOne({ _id: noteId })
    if (!note) return notFound("Note")

    return fetched(`Day Note`, {
      note: {
        ...note._doc,
        created_at: convertTimeZone(note.created_at, timeZone),
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getNoteById
