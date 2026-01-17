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
      index: true,
    },

    daily: { type: Boolean, default: false, index: true, required: false }, // true = template
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayTask",
      default: null,
      index: true,
    },

    privacy: {
      type: String,
      enum: ["public", "private", "close friends"],
      default: "public",
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "public", "rejected", "deleted"],
      default: "public",
      index: true,
    },
    deletedAt: { type: Date, default: null, required: false },
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
dayTaskSchema.index({ user: 1, daily: 1 })
dayTaskSchema.index(
  { user: 1, dayKey: 1, template: 1 },
  { unique: true, partialFilterExpression: { template: { $type: "objectId" } } }
)

const DayTask = mongoose.model("DayTask", dayTaskSchema, "dayTask")
module.exports = DayTask
