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
  ban_history: [
    {
      banned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      ban_date: { type: Date, required: false },
      ban_message: {
        type: String,
        required: false,
      },

      unban_date: { type: Date, required: false },
      unban_message: {
        type: String,
        required: false,
      },
      unbanned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },
  ],
})

const Storie = mongoose.model("Storie", storieSchema, "stories")

module.exports = Storie
