const mongoose = require("mongoose")

const postCommentsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },
  comment: String,
  gif: {
    title: String,
    id: String,
    url: String,
  },

  status: {
    type: String,
    enum: ["pending", "public", "rejected", "deleted"],
    default: "public",
    index: true,
  },
  deletedAt: { type: Date, default: null, required: false },
})

const PostComments = mongoose.model(
  "PostComments",
  postCommentsSchema,
  "postComments"
)

module.exports = PostComments
