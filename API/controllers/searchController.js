const Post = require('../models/Post')
const User = require('../models/User')

const bf = require('better-format')
const {
    filterPosts,
    filterFollowing
} = require('../common/filterPosts')

const performAggregation = async (sortStage = { _id: 1 }, searchQuery = '') => {
    return await Post.aggregate([
        {
            $lookup: {
                from: 'users',
                let: { userId: { $toObjectId: '$user' } },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$userId'] }
                        }
                    },
                ],
                as: 'user_info'
            }
        },
        {
            $match: {
                $or: [
                    { title: { $regex: new RegExp(searchQuery, 'i') } },
                    { 'user_info.name': { $regex: new RegExp(searchQuery, 'i') } }
                ]
            }
        },
        {
            $addFields: {
                relevance: { $sum: ['$reactions', '$comments'] }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                data: 1,
                user: 1,
                reactions: 1,
                comments: 1,
                created_at: 1,
                user_info: { $arrayElemAt: ['$user_info', 0] }
            }
        },
        sortStage
    ]);
}



const algorithm = async (req, res) => {
    const day = req.query.day || bf.FormatDate(Date.now()).day
    const loggedUserId = req.id
    const order = req.query.order || 'relevant'
    const following = req.query.following === 'true'

    try {
        let posts = []

        if (order === 'relevant')
            posts = await performAggregation({ $sort: { relevance: -1 } })
        else // recent
            posts = await performAggregation({ $sort: { created_at: -1 } })

        if (following)
            posts = await filterFollowing(posts, loggedUserId)
        

        const filteredPosts = await filterPosts(posts, loggedUserId)

        res.status(200).json({ posts: filteredPosts })
    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
};

const search = async (req, res) => {
    const day = req.query.day || bf.FormatDate(Date.now()).day
    const searchQuery = req.query.q || ''
    const order = req.query.order || 'relevant'
    const following = req.query.following === 'true' || false
    const filter = req.query.filter || 'posts'

    const loggedUserId = req.id

    try {
        // SEARCH USER
        if(filter == 'users'){
            let users = await User.find({ name: { $regex: new RegExp(searchQuery, 'i'), }, })
            return res.status(200).json({ users })
        }

        let posts = []

        if (order === 'relevant')
            posts = await performAggregation({ $sort: { relevance: -1 } }, searchQuery)
        else if (order === 'recent')
            posts = await performAggregation({ $sort: { created_at: -1 } }, searchQuery)

        if (following)
            posts = await filterFollowing(posts, loggedUserId)

        const filteredPosts = await filterPosts(posts, loggedUserId)

        res.status(200).json({ posts: filteredPosts })
    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
};

module.exports = {
    algorithm,
    search
}
