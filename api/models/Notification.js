const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
})

notificationSchema.index({ user: 1, created_at: -1 })
notificationSchema.index({ user: 1, read: 1, created_at: -1 })

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification
