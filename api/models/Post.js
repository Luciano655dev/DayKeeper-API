const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
  title: String,
  data: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  edited_at: {
    type: Date,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  files: [
    {
      name: String,
      key: String,
      mimetype: String,
      url: String,
    },
  ],

  reports: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      created_at: { type: Date, default: Date.now() },
      reason: String,
    },
  ],

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

const Post = mongoose.model("Post", postSchema)

module.exports = Post
