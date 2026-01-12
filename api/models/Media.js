const mongoose = require("mongoose")

const mediaSchema = mongoose.Schema({
  title: String,
  key: String,
  type: String, // 'image' / 'video'
  url: String,
  placeId: String,

  verified: Boolean,

  status: String, // 'private', 'pending', 'public'
  jobId: String,
  usedIn: {
    model: String,
    refId: String,
  },
  uploadedBy: String,
  created_at: Date,
})

const Media = mongoose.model("Media", mediaSchema, "media")

module.exports = Media
