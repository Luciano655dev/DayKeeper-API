const mongoose = require('mongoose')

const bannedUserSchema = mongoose.Schema({
    email: String,
    ban_message: String,
    ban_date: Date,
    banned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
})

const BannedUser = mongoose.model('BannedUser', bannedUserSchema, 'banned_users')

module.exports = BannedUser