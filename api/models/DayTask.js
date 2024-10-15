const mongoose = require("mongoose")

const dayTaskSchema = mongoose.Schema({
  title: String,
  value: Boolean,
  date: String,
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

const DayTask = mongoose.model("DayTask", dayTaskSchema, "dayTask")

module.exports = DayTask
