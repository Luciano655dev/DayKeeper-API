const mongoose = require("mongoose")

const storieSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  privacy: {
    type: String,
    enum: ["public", "private", "close friends"],
    default: "public",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  media: String,
  placeId: String,
  status: String,
  text: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

  banned: { type: String, required: false },
})

const Storie = mongoose.model("Storie", storieSchema, "stories")

module.exports = Storie
