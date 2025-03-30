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

  // Post strikes, like Duolingo
  currentStrike: Number,
  maxStrike: Number,

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

  banned: { type: String, required: false },
})

const User = mongoose.model("User", userSchema)

module.exports = User
