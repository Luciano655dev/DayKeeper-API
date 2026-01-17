const mongoose = require("mongoose")

const deleteNoteDoc = require("./delete/deleteNotes")

const {
  errors: { notFound, invalidValue },
  success: { deleted },
} = require("../../../../constants/index")

const deleteNote = async (props) => {
  const { noteId } = props || {}

  if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
    return invalidValue("Note ID")
  }

  const changed = await deleteNoteDoc(noteId)

  if (!changed) return notFound("Note")

  return deleted("Day Note")
}

module.exports = deleteNote
