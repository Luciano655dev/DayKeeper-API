const mongoose = require("mongoose")

const dayEventSchema = mongoose.Schema({
  title: String,
  description: String,
  dateStart: Date,
  dateEnd: Date,
  location: String,
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

const DayEvent = mongoose.model("DayEvent", dayEventSchema, "dayEvent")

module.exports = DayEvent

/*
  TODO: Make the location with name, id, lat and lng.
  Can't do it now because the account on google cloud console is suspended.
*/
