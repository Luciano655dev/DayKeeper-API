const mongoose = require("mongoose")

const dayTaskSchema = mongoose.Schema({
  day: String,
  title: String,
  marked: Boolean,
  createdAt: {
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
