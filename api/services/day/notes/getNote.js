const DayNote = require("../../../models/DayNote")
const getNotePipline = require("../../../repositories/pipelines/day/notes/getNotePipeline")
const mongoose = require("mongoose")

const {
  errors: { invalidValue, notFound },
  success: { fetched },
} = require("../../../../constants/index")

const getNote = async ({ noteId, loggedUser }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return invalidValue("Note ID")

    const note = await DayNote.aggregate(getNotePipline(noteId, loggedUser))
    if (!note || note?.length == 0) return notFound("Note")

    return fetched("note", { data: note[0] })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getNote
