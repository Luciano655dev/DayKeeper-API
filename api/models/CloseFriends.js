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

const CloseFriends = mongoose.model(
  "CloseFriends",
  closeFriendsSchema,
  "closeFriends"
)

module.exports = CloseFriends
