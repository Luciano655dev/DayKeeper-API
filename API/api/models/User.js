require('dotenv').config()
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  googleId: {
    type: String,
    required: false
  },
  profile_picture: {
    name: String,
    key: String,
    url: String
  },
  timeZone: String,
  bio: String,
  verified_email: Boolean,
  password: String,
  private: Boolean,
  roles: [ String ], // ['user', 'admin']

  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },

  verification_code: {
    type: String,
    required: false
  },
  verification_time: {
    type: Date,
    required: false
  },

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

  reports: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      created_at: { type: Date, default: Date.now() },
      reason: String
    }
  ],

  banned: { type: String, required: false },

  ban_history: [{
    banned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    ban_date: { type: Date, required: false },
    ban_message: {
      type: String,
      required: false
    },

    unban_date: { type: Date, required: false },
    unban_message: {
      type: String,
      required: false
    },
    unbanned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User
