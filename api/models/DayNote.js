const mongoose = require("mongoose")

const dayNoteSchema = mongoose.Schema({
  text: String,
  date: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const DayNote = mongoose.model("DayNote", dayNoteSchema, "dayNote")

module.exports = DayNote
