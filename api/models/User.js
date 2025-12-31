require("dotenv").config()
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  profile_picture: {
    name: String,
    key: String,
    url: String,
  },
  password: { type: String, default: null },
  timeZone: String,
  bio: String,
  verified_email: Boolean,
  private: Boolean,
  roles: [String], // ['user', 'admin']
  google_id: { type: String, index: true, sparse: true, unique: true },

  // Post strikes, like Duolingo
  currentStrike: { type: Number, default: 0 },
  maxStrike: { type: Number, default: 0 },

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
    index: true,
  },

  verification_code_hash: {
    type: String,
    required: false,
  },
  verification_expires_at: {
    type: Date,
    required: false,
  },
  reset_code_hash: {
    type: String,
    required: false,
  },
  reset_expires_at: {
    type: Date,
    required: false,
  },

  banned: { type: Boolean, default: false, required: false },
})

const User = mongoose.model("User", userSchema)

module.exports = User
