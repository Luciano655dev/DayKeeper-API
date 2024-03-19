require('dotenv').config()
const Post = require('../models/Post')
const User = require('../models/User')
const bf = require('better-format')

const PostsPerformAggregation = async (mainUserId, sortStage = { _id: 1 }, searchQuery = '', pageNumber = 1, pageSize = 10, filterOptions = {}) => {
    let mainUser = await User.findById(mainUserId)
    mainUser.following = await User.distinct('_id', { followers: mainUserId })

    let todayDate = bf.FormatDate(Date.now())
    const resetTime = process.env.RESET_TIME
    todayDate = `${todayDate.hour < resetTime ? todayDate.day - 1 : todayDate.day}-${todayDate.month}-${todayDate.year}`

    const skipCount = (pageNumber - 1) * pageSize
    const totalPosts = await Post.countDocuments()
    const totalPages = Math.ceil(totalPosts / pageSize)


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

    if(filterOptions.following == 'following')
        pipeline.push({ $match: { 'user': { $in: mainUser.following } } })
    else if(filterOptions.following == 'friends')
        pipeline.push({ $match: { $and: [
                { 'user': { $in: mainUser.following } }, // o mainUser esta seguindo ele
                { 'user_info.followers': mainUser._id } // o outro user esta te seguindo
            ]}
        })

    // Sorting
    pipeline.push(
        sortStage,
        { $skip: skipCount },
        { $limit: pageSize }
    )

    const posts = await Post.aggregate(pipeline)

    return {
        posts,
        page: pageNumber,
        pageSize: posts.length,
        maxPageSize: pageSize,
        totalPages
    }
}

const UsersPerformAggregation = async(mainUserId, searchQuery = '', pageNumber = 1, pageSize = 10)=>{
    let mainUser = await User.findById(mainUserId)

    const skipCount = (pageNumber - 1) * pageSize
    const totalPosts = await Post.countDocuments()
    const totalPages = Math.ceil(totalPosts / pageSize)


    const pipeline = [
        {
            $match: {
                $and: [
                    { '_id': { $nin: mainUser.blocked_users } },
                    {
                        name: { $regex: new RegExp(searchQuery, 'i') }
                    },
                    {
                        $or: [
                            { private: false },
                            { 
                                $and: [
                                    { private: true },
                                    { followers: mainUser._id }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        { $skip: skipCount },
        { $limit: pageSize }
    ]

    const users = await User.aggregate(pipeline)

    return {
        users,
        page: pageNumber,
        pageSize: users.length,
        maxPageSize: pageSize,
        totalPages
    }
}

const search = async (req, res) => {
    const page = Number(req.query.page) || 1
    const pageSize = ( Number(req.query.pageSize) <= 100 ? Number(req.query.pageSize) : 100) || 2

    const dayRegexFormat = /^\d{2}-\d{2}-\d{4}$/
    let day = dayRegexFormat.test(req.query.day) ? req.query.day : undefined

    const searchQuery = req.query.q || ''
    const order = req.query.order || 'relevant'
    const following = req.query.following
    const type = req.query.type || 'posts'

    const loggedUserId = req.id

    try {
        let sortPipeline = { $sort: { created_at: -1 } } // recent

        if (order === 'relevant')
            sortPipeline = { $sort: { isTodayDate: -1, relevance: -1 } } // relevant

        let response
        if(type == 'posts'){
            response = await PostsPerformAggregation(
                loggedUserId,
                sortPipeline,
                searchQuery,
                page,
                pageSize,
                { day, following }
            )
        } else { // type == users
            response = await UsersPerformAggregation(
                loggedUserId,
                searchQuery,
                page,
                pageSize
            )
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ error: `${error}` })
    }
}

module.exports = {
    search
}
