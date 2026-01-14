const mongoose = require("mongoose")

const PRIVACY = ["public", "private", "close friends"]

const dayEventSchema = new mongoose.Schema(
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
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    created_at: {
      type: Date,
      default: Date.now,
    },

    dateStart: {
      type: Date,
      required: true,
      index: true,
    },

    dateEnd: {
      type: Date,
      required: true,
      index: true,
      validate: {
        validator: function (v) {
          // allow save only if dateEnd >= dateStart
          return !this.dateStart || !v || v >= this.dateStart
        },
        message: "dateEnd must be >= dateStart",
      },
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    privacy: {
      type: String,
      enum: PRIVACY,
      default: "public",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

dayEventSchema.index({ user: 1, dateStart: 1 })
dayEventSchema.index({ user: 1, dateEnd: 1 })
dayEventSchema.index({ user: 1, privacy: 1, dateStart: 1 })

const DayEvent = mongoose.model("DayEvent", dayEventSchema, "dayEvent")
module.exports = DayEvent
