const DayNote = require("../../../models/DayNote")
const mongoose = require("mongoose")

const {
  errors: { invalidValue },
  success: { updated },
} = require("../../../../constants/index")

const editNote = async (props) => {
  const {
    noteId,

    text,
    date,
    loggedUser,
  } = props

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return invalidValue("Note ID")

    const updateData = {
      ...(text && { text }),
      ...(date && { date }),
      user: loggedUser._id,
    }

    await DayNote.findByIdAndUpdate(
      noteId,
      {
        $set: updateData,
      },
      { new: true }
    )

    return updated(`Day Note`)
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = editNote
