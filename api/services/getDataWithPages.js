const Post = require("../models/Post")
const User = require("../models/User")
const Storie = require("../models/Storie")
const Followers = require("../models/Followers")
const Blocks = require("../models/Blocks")
const PostLikes = require("../models/PostLikes")
const PostComments = require("../models/PostComments")
const CommentLikes = require("../models/CommentLikes")
const StorieLikes = require("../models/StorieLikes")
const StorieViews = require("../models/StorieViews")
const Report = require("../models/Report")
const BanHistory = require("../models/BanHistory")
const DayEvent = require("../models/DayEvent")
const DayNote = require("../models/DayNote")
const DayTask = require("../models/DayTask")

const { maxPageSize: defaultMaxPageSie } = require("../../constants/index")

const getDataWithPages = async (
  { type, pipeline, order, following, page, maxPageSize },
  mainUser
) => {
  page = Number(page)
  maxPageSize = Number(maxPageSize)

  if (isNaN(page)) page = 1
  if (isNaN(maxPageSize)) maxPageSize = defaultMaxPageSie

  const skipCount = (page - 1) * maxPageSize
  let newPipeline = [...pipeline]

  // ========== FOLLOWING ==========
  let canApplyFollowing = type == `Post` || type == `User`
  if (canApplyFollowing && following) {
    const userIdField = type === "Post" ? "user_info._id" : "_id"

    if (following === "following") {
      newPipeline.push({
        $lookup: {
          from: "followers",
          let: { userId: `$${userIdField}` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followerId", mainUser._id] },
                    { $eq: ["$followingId", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "following_info",
        },
      })

      newPipeline.push({ $match: { "following_info.0": { $exists: true } } })
    } else if (following === "friends") {
      newPipeline.push({
        $lookup: {
          from: "followers",
          let: { userId: `$${userIdField}` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followerId", mainUser._id] },
                    { $eq: ["$followingId", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "following_info",
        },
      })

      newPipeline.push({
        $lookup: {
          from: "followers",
          let: { userId: `$${userIdField}` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followingId", mainUser._id] },
                    { $eq: ["$followerId", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "followers_info",
        },
      })

      newPipeline.push({
        $match: {
          $and: [
            { "following_info.0": { $exists: true } },
            { "followers_info.0": { $exists: true } },
          ],
        },
      })
    }
  }

  // ========== SORT ===========
  let sortPipeline
  switch (order) {
    case "relevant":
      sortPipeline = {
        $sort: { created_at: -1, relevance: -1, timeZoneMatch: -1, _id: 1 },
      }
      break
    case "recent_ban":
      sortPipeline = { $sort: { ban_date: 1, _id: 1 } }
      break
    case "recent":
    default: // default is 'recent'
      sortPipeline = { $sort: { created_at: -1, timeZoneMatch: -1, _id: 1 } }
      break
  }

  try {
    // ========== AGGREGATION ==========
    const aggregationPipeline = [
      {
        $facet: {
          data: [
            ...newPipeline,
            sortPipeline,
            { $skip: skipCount },
            { $limit: maxPageSize },
          ],
          totalCount: [...newPipeline, { $count: "total" }],
        },
      },
      { $unwind: "$totalCount" },
    ]

    let Model
    switch (type) {
      case "Post":
        Model = Post
        break
      case "Storie":
        Model = Storie
        break
      case "User":
        Model = User
        break
      case "Follower":
        Model = Followers
        break
      case "Block":
        Model = Blocks
        break
      case "PostLikes":
        Model = PostLikes
        break
      case "PostComments":
        Model = PostComments
        break
      case "CommentLikes":
        Model = CommentLikes
        break
      case "StorieLikes":
        Model = StorieLikes
        break
      case "StorieViews":
        Model = StorieViews
        break
      case "Report":
        Model = Report
        break
      case "BanHistory":
        Model = BanHistory
        break
      case "DayNote":
        Model = DayNote
        break
      case "DayTask":
        Model = DayTask
        break
      case "DayEvent":
        Model = DayEvent
        break
      default:
        throw new Error(`Invalid type: ${type}`)
    }

    const result = await Model.aggregate(aggregationPipeline)
    const { data, totalCount } = result[0] || { data: [], totalCount: 0 }

    const totalPages = Math.ceil(totalCount.total / maxPageSize) || 0

    return {
      data,
      page,
      pageSize: data.length,
      maxPageSize,
      totalPages,
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getDataWithPages
