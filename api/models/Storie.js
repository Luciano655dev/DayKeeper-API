const mongoose = require("mongoose")

const storieSchema = mongoose.Schema({
  title: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  file: {
    name: String,
    key: String,
    mimetype: String,
    url: String,
    placeId: {
      required: false,
      type: String,
    },
  },
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
