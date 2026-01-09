const mongoose = require("mongoose")
const DayNote = require("../../../models/DayNote")
const { parseISO, isValid } = require("date-fns")

const {
  errors: { invalidValue, notFound, unauthorized },
  success: { updated },
} = require("../../../../constants/index")

const editNote = async (props) => {
  const { noteId, text, date, privacy, loggedUser } = props || {}

  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
    return invalidValue("Note ID")
  }

  try {
    const updateData = {}

    if (Object.prototype.hasOwnProperty.call(props, "text"))
      updateData.text = text
    if (Object.prototype.hasOwnProperty.call(props, "date"))
      updateData.date = date
    if (Object.prototype.hasOwnProperty.call(props, "privacy"))
      updateData.privacy = privacy
    if (Object.prototype.hasOwnProperty.call(props, "date")) {
      // parse ISO
      const d = typeof date === "string" ? parseISO(date) : new Date(date)
      if (!isValid(d)) return invalidValue("Date")
      updateData.date = d
    }

    if (Object.keys(updateData).length === 0) {
      return invalidValue("No fields to update")
    }

    const doc = await DayNote.findOneAndUpdate(
      { _id: noteId, user: loggedUser._id }, // ownership enforced (atomic)
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!doc) {
      return notFound("Note")
    }

    return updated("Day Note", { data: doc })
  } catch (error) {
    throw error
  }
}

module.exports = editNote
