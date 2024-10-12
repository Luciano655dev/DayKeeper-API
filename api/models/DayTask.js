const mongoose = require("mongoose")

const dayTaskSchema = mongoose.Schema({
  title: String,
  value: Boolean,
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

const DayTask = mongoose.model("DayTask", dayTaskSchema, "dayTask")

module.exports = DayTask
