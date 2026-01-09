const mongoose = require("mongoose")

const closeFriendsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  closeFriendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

// indexes
closeFriendsSchema.index({ userId: 1, closeFriendId: 1 }, { unique: true })

const CloseFriends = mongoose.model(
  "CloseFriends",
  closeFriendsSchema,
  "closeFriends"
)

module.exports = CloseFriends
