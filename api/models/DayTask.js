const mongoose = require("mongoose")

const dayTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 160,
    },

    completed: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    privacy: {
      type: String,
      enum: ["public", "private", "close friends"],
      default: "public",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Indexes
dayTaskSchema.index({ user: 1, date: 1 })
dayTaskSchema.index({ user: 1, completed: 1, date: 1 })
dayTaskSchema.index({ user: 1, privacy: 1, date: 1 })

const DayTask = mongoose.model("DayTask", dayTaskSchema, "dayTask")
module.exports = DayTask
