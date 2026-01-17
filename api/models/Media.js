const mongoose = require("mongoose")

const mediaSchema = mongoose.Schema({
  title: String,
  key: String,
  type: String, // 'image' / 'video'
  url: String,

  verified: Boolean,

  jobId: String,
  usedIn: {
    model: String,
    refId: String,
  },
  uploadedBy: String,
  created_at: Date,

  status: {
    type: String,
    enum: ["pending", "public", "rejected", "deleted"],
    default: "pending",
    index: true,
  },
  deletedAt: { type: Date, default: null, required: false },
})

const Media = mongoose.model("Media", mediaSchema, "media")

module.exports = Media
