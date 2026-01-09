const mongoose = require("mongoose")
const DayNote = require("../../../models/DayNote")
const getNotePipeline = require("../../../repositories/pipelines/day/notes/getNotePipeline")

const {
  errors: { invalidValue, notFound, unauthorized },
  success: { fetched },
} = require("../../../../constants/index")

const getNote = async ({ noteId, loggedUser }) => {
  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return invalidValue("Note ID")
  }

  try {
    const note = await DayNote.aggregate(getNotePipeline(noteId, loggedUser))
    if (!note || note.length === 0) return notFound("Note")

    return fetched("note", { data: note[0] })
  } catch (error) {
    throw error
  }
}

module.exports = getNote
