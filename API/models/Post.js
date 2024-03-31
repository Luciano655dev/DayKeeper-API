const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: String,
    data: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    edited_at: {
        type: Date,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    images: [
        {
            name: String,
            key: String,
            url: String
        }
    ],

    reports: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
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
    }],

    reactions: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            reaction: Number
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: String,
            gif: {
                name: String,
                id: String,
                url: String
            },
            created_at: {
                type: Date,
                default: Date.now()
            },
            reactions: [
                {
                    user: String,
                    reaction: Number
                }
            ],
        }
    ]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
