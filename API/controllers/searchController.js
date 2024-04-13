require('dotenv').config()
const Post = require('../models/Post')
const User = require('../models/User')
const bf = require('better-format')

const PostsPerformAggregation = async (mainUserId, sortStage = { _id: 1 }, searchQuery = '', pageNumber = 1, pageSize = 10, filterOptions = {}) => {
    let mainUser = await User.findById(mainUserId)
    mainUser.following = await User.distinct('_id', { followers: mainUserId })

    const resetTime = process.env.RESET_TIME
    let todayDate = bf.FormatDate(Date.now())
    todayDate = `${todayDate.hour < resetTime ? todayDate.day - 1 : todayDate.day}-${todayDate.month}-${todayDate.year}`

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
                    {
                      $project: {
                        password: 0
                      }
                    }
                ],
                as: 'user_info'
            }
        },
        {
            $match: {
                $and: [
                    { 'user': { $nin: mainUser.blocked_users } },
                    { 'user_info.banned': { $ne: "true" } },
                    { 'banned': { $ne: "true" } },
                    {
                        $or: [
                            { title: { $regex: new RegExp(searchQuery, 'i') } },
                            { 'user_info.name': { $regex: new RegExp(searchQuery, 'i') } },
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
                files: 1,
                created_at: 1,
                reactions: {
                    $map: {
                        input: [0, 1, 2, 3, 4],
                        as: "reactionValue",
                        in: {
                            $size: {
                                $filter: {
                                    input: "$reactions",
                                    as: "reaction",
                                    cond: { $eq: ["$$reaction.reaction", "$$reactionValue"] }
                                }
                            }
                        }
                    }
                },
                comments: { $size: '$comments' },
                user_info: { $arrayElemAt: ['$user_info', 0] }
            }
        }
    ]

    if(filterOptions.following == 'following')
        pipeline.push({ $match: { 'user': { $in: mainUser.following } } })
    else if(filterOptions.following == 'friends')
        pipeline.push({ $match: { $and: [
                { 'user': { $in: mainUser.following } }, // o mainUser esta seguindo ele
                { 'user_info.followers': mainUser._id } // o outro user esta te seguindo
            ]}
        })

    // Aggregating the count without sorting, skipping, or limiting
    const totalPostsAggregationResult = await Post.aggregate([...pipeline, { $count: "total" }])
    const totalPosts = (totalPostsAggregationResult.length > 0) ? totalPostsAggregationResult[0].total : 0
    const totalPages = Math.ceil(totalPosts / pageSize)

    // Sorting
    pipeline.push(
        sortStage,
        { $skip: skipCount },
        { $limit: pageSize }
    )

    const posts = await Post.aggregate(pipeline)

    return {
        data: posts,
        page: pageNumber,
        pageSize: posts.length,
        maxPageSize: pageSize,
        totalPages
    }
}

const UsersPerformAggregation = async(mainUserId, searchQuery = '', pageNumber = 1, pageSize = 10)=>{
    let mainUser = await User.findById(mainUserId)
    const skipCount = (pageNumber - 1) * pageSize

    const pipeline = [
        {
            $match: {
                $and: [
                    { '_id': { $nin: mainUser.blocked_users } },
                    { 'banned': { $ne: true } },
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
        {
          $project: {
            password: 0
          }
        }
    ]

    // Aggregating the count without sorting, skipping, or limiting
    const totalUsersAggregationResult = await User.aggregate([...pipeline, { $count: "total" }])
    const totalUsers = (totalUsersAggregationResult.length > 0) ? totalUsersAggregationResult[0].total : 0
    const totalPages = Math.ceil(totalUsers / pageSize)

    pipeline.push(
        { $skip: skipCount },
        { $limit: pageSize }
    )

    const users = await User.aggregate(pipeline)

    return {
        data: users,
        page: pageNumber,
        pageSize: users.length,
        maxPageSize: pageSize,
        totalPages
    }
}

const search = async (req, res) => {
    const page = Number(req.query.page) || 1
    const pageSize = req.query.pageSize ? ( Number(req.query.pageSize) <= 100 ? Number(req.query.pageSize) : 100) : 3

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
                { following }
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
