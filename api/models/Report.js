const mongoose = require("mongoose")

const ReportSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  type: String, // 'user' or 'post'
  reason: String,
  created_at: Date,
})

const Report = mongoose.model("Report", ReportSchema, "reports")

module.exports = Report
