const mongoose = require("mongoose")
const DayNote = require("../../../models/DayNote")

const {
  errors: { notFound, unauthorized, invalidValue },
  success: { deleted },
} = require("../../../../constants/index")

const deleteNote = async (props) => {
  const { noteId, loggedUser } = props || {}

  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
    return invalidValue("Note ID")
  }

  try {
    const doc = await DayNote.findOneAndDelete({
      _id: noteId,
      user: loggedUser._id,
    }).select("_id")

    if (!doc) {
      return notFound("Note")
    }

    return deleted("Day Note")
  } catch (error) {
    throw error
  }
}

module.exports = deleteNote
