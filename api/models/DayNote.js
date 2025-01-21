const mongoose = require("mongoose")

const dayNoteSchema = mongoose.Schema({
  date: Date,
  text: String,
  privacy: {
    type: String,
    enum: ["public", "private", "close friends"],
    default: "public",
  },
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
