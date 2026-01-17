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

  status: {
    type: String,
    enum: ["pending", "public", "rejected", "deleted"],
    default: "public",
    index: true,
  },
  deletedAt: { type: Date, default: null, required: false },
})

followersSchema.index({ followerId: 1 })
followersSchema.index({ followingId: 1 })
followersSchema.index({ followerId: 1, followingId: 1 }, { unique: true })
followersSchema.index({ followerId: 1, followingId: 1, requested: 1 })
followersSchema.index({ followingId: 1, requested: 1 })

const Followers = mongoose.model("Followers", followersSchema, "followers")

module.exports = Followers
