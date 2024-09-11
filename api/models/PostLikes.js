const mongoose = require("mongoose")

const postLikesSchema = mongoose.Schema({
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
    ref: "Post",
  },
})

const PostLikes = mongoose.model("PostLikes", postLikesSchema, "postLikes")

module.exports = PostLikes
