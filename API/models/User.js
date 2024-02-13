require('dotenv').config()
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  profile_picture: {
    name: String,
    size: Number,
    key: String,
    url: String
  }, // Image on Base64
  verified_email: Boolean,
  password: String,
  private: Boolean,
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  follow_requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  ],
  blocked_users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  creation_date: {
    type: Date,
    default: Date.now,
    required: true
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
