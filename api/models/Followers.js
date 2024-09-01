const mongoose = require("mongoose")

const followersSchema = mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requested: {
    type: Boolean,
    required: false,
  },
})

const Followers = mongoose.model("Followers", followersSchema, "followers")

module.exports = Followers
