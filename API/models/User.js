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
  ]
})

const User = mongoose.model('User', userSchema)

module.exports = User
