require("dotenv").config()
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  profile_picture: {
    name: String,
    key: String,
    url: String,
  },
  timeZone: String,
  bio: String,
  verified_email: Boolean,
  password: String,
  private: Boolean,
  roles: [String], // ['user', 'admin']

  google_id: {
    type: String,
    required: false,
  },

  device_tokens: [
    {
      type: String,
      required: false,
    },
  ],

  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },

  verification_code: {
    type: String,
    required: false,
  },
  verification_time: {
    type: Date,
    required: false,
  },

  reports: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      created_at: { type: Date, default: Date.now() },
      reason: String,
    },
  ],

  banned: { type: String, required: false },

  ban_history: [
    {
      banned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      ban_date: { type: Date, required: false },
      ban_message: {
        type: String,
        required: false,
      },

      unban_date: { type: Date, required: false },
      unban_message: {
        type: String,
        required: false,
      },
      unbanned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },
  ],
})

const User = mongoose.model("User", userSchema)

module.exports = User
