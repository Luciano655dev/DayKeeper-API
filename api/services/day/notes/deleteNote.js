const DayNote = require("../../../models/DayNote")
const getNote = require("./getNote")

const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../../constants/index")

const deleteNote = async (props) => {
  const { noteId, loggedUser } = props

  try {
    const note = await getNote({ noteId, loggedUser })
    if (!note) return notFound("Note")

    if (!note.data.user.equals(loggedUser._id))
      return unauthorized(
        "You can't delete this note",
        "only the person who creted this note can delete it",
        409
      )

    await DayNote.findOneAndDelete({ _id: noteId })

    return deleted(`Day Note`)
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = deleteNote
