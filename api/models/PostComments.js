const mongoose = require("mongoose")

const postCommentsSchema = mongoose.Schema({
  userId: {
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
    name: String,
    id: String,
    url: String,
  },
})

const PostComments = mongoose.model(
  "PostComments",
  postCommentsSchema,
  "postComments"
)

module.exports = PostComments
