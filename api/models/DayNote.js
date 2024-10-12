const mongoose = require("mongoose")

const dayNoteSchema = mongoose.Schema({
  day: String,
  data: String,
  createdAt: {
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
