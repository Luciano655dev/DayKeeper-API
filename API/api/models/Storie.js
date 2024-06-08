const mongoose = require('mongoose')

const storieSchema = mongoose.Schema({
    day: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    file: {
        name: String,
        key: String,
        mimetype: String,
        url: String
    },
    text: {
        type: String,
        required: false,
    },

    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    reactions: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            reaction: Number
        }
    ],

    reports: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: String
    }],
})

const Storie = mongoose.model('Storie', storieSchema, 'stories')

module.exports = Storie