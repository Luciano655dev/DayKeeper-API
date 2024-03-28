require('dotenv').config()
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  profile_picture: {
    name: String,
    key: String,
    url: String
  },
  verified_email: Boolean,
  password: String,
  private: Boolean,
  roles: [ String ], // ['user', 'admin']

  creation_date: {
    type: Date,
    default: Date.now,
    required: true
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
      reason: String
    }
  ],

  banned: { type: String, required: false },

  // caso o usuario esteja banido
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

  // caso alguem tenha desbanido o usuario
  unban_date: { type: Date, required: false },
  unban_message: {
    type: String,
    required: false
  },
  unbanned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
