const mongoose = require("mongoose")

const dayEventSchema = mongoose.Schema({
  title: String,
  description: String,
  date: String,
  timeStart: Date,
  timeEnd: Date,
  location: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const DayEvent = mongoose.model("DayEvent", dayEventSchema, "dayEvent")

module.exports = DayEvent

// TODO: faer o location com id, name, lat e lng
