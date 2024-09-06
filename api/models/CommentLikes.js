const mongoose = require("mongoose")

const commentLikesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
})

const CommentLikes = mongoose.model(
  "CommentLikes",
  commentLikesSchema,
  "commentLikes"
)

module.exports = CommentLikes
