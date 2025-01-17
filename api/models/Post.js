const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
  date: Date,
  data: String,
  emotion: Number,
  privacy: {
    type: String,
    enum: ["public", "private", "close friends"],
    default: "public",
  },
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
      placeId: {
        required: false,
        type: String,
      },
    },
  ],

  banned: { type: Boolean, required: false },
})

const Post = mongoose.model("Post", postSchema)

module.exports = Post
