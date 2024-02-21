const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: String,
    data: String,
    user: String,
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
            size: Number,
            key: String,
            url: String
        }
    ],
    reactions: [
        {
            user: String,
            reaction: Number
        }
    ],
    comments: [
        {
            user: String,
            comment: String,
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

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
