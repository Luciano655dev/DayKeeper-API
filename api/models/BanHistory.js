const mongoose = require("mongoose")

const banHistorySchema = new mongoose.Schema({
  entity_type: {
    type: String, // 'user', 'post', 'story'
    required: true,
  },
  action_type: {
    type: String, // 'ban', 'unban' or 'suspension'
    required: true,
  },
  entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // ban
  banned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  ban_date: {
    type: Date,
    required: false,
  },
  ban_message: {
    type: String,
    required: false,
  },

  // unban
  unban_date: {
    type: Date,
    required: false,
  },
  unban_message: {
    type: String,
    required: false,
  },
  unbanned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

const BanHistory = mongoose.model("BanHistory", banHistorySchema, "banHistory")

module.exports = BanHistory
