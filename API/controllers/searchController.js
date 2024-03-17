const Post = require('../models/Post')
const User = require('../models/User')
const bf = require('better-format')

const performAggregation = async (mainUserId, sortStage = { _id: 1 }, searchQuery = '', pageNumber = 1, pageSize = 10, filterOptions = {}) => {
    let mainUser = await User.findById(mainUserId)
    mainUser.following = await User.distinct('_id', { followers: mainUserId })

    let todayDate = bf.FormatDate(Date.now())
    todayDate = `${todayDate.day}-${todayDate.month}-${todayDate.year}`

    const skipCount = (pageNumber - 1) * pageSize

    const pipeline = [
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
                $and: [
                    { 'user': { $nin: mainUser.blocked_users } },
                    { 'user': { $ne: mainUser._id } },
                    {
                        $or: [
                            { title: { $regex: new RegExp(searchQuery, 'i') } },
                            { data: { $regex: new RegExp(searchQuery, 'i') } },
                            { 'user_info.name': { $regex: new RegExp(searchQuery, 'i') } }
                        ]
                    },
                    {
                        $or: [
                            { 'user_info.private': false },
                            { 
                                $and: [
                                    { 'user_info.private': true },
                                    { 'user_info.followers': mainUser._id }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            $addFields: {
                relevance: { $sum: ['$reactions', '$comments'] },
                isToday: { $eq: ['$title', todayDate] }
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
        }
    ]

    if (filterOptions.day)
        pipeline.push({ $match: { title: filterOptions.day } })

    if(filterOptions.following)
        pipeline.push({ $match: { 'user': { $in: mainUser.following } } })

    // Sorting
    pipeline.push(
        sortStage,
        { $skip: skipCount },
        { $limit: pageSize }
    )

    return await Post.aggregate(pipeline)
}

const search = async (req, res) => {
    const page = Number(req.query.page) || 1
    const pageSize = 10

    const dayRegexFormat = /^\d{2}-\d{2}-\d{4}$/
    let day = dayRegexFormat.test(req.query.day) ? req.query.day : undefined

    const searchQuery = req.query.q || ''
    const order = req.query.order || 'relevant'
    const following = req.query.following === 'true' || false

    const loggedUserId = req.id

    try {
        let sortPipeline = { $sort: { created_at: -1 } } // recent

        if (order === 'relevant')
            sortPipeline = { $sort: { isTodayDate: -1, relevance: -1 } } // relevant

        const posts = await performAggregation(
            loggedUserId,
            sortPipeline,
            searchQuery,
            page,
            pageSize,
            { day, following }
        )

        return res.status(200).json({ posts })
    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}

module.exports = {
    search
}
