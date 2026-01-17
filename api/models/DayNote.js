const mongoose = require("mongoose")

const dayNoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000,
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

// indexes
dayNoteSchema.index({ user: 1, date: 1 })
dayNoteSchema.index({ user: 1, privacy: 1, date: 1 })

const DayNote = mongoose.model("DayNote", dayNoteSchema, "dayNote")
module.exports = DayNote
