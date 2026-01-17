const mongoose = require("mongoose")

const bannedUserSchema = mongoose.Schema({
  email: String,
  ban_message: String,
  ban_date: Date,
  banned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["pending", "public", "rejected", "deleted"],
    default: "public",
    index: true,
  },
  deletedAt: { type: Date, default: null, required: false },
})

const BannedUser = mongoose.model(
  "BannedUser",
  bannedUserSchema,
  "banned_users"
)

module.exports = BannedUser
