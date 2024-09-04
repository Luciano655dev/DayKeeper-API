const mongoose = require("mongoose")

const postLikesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const PostLikes = mongoose.model("PostLikes", postLikesSchema, "postLikes")

module.exports = PostLikes
