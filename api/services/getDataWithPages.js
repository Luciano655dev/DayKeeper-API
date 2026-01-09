const { Types } = require("mongoose")

const Post = require("../models/Post")
const User = require("../models/User")
const Storie = require("../models/Storie")
const Followers = require("../models/Followers")
const Blocks = require("../models/Blocks")
const CloseFriend = require("../models/CloseFriends")
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

const { maxPageSize: DEFAULT_MAX_PAGE_SIZE } = require("../../constants/index")

function toObjectIdOrNull(id) {
  try {
    if (!id) return null
    if (id instanceof Types.ObjectId) return id
    if (Types.ObjectId.isValid(id)) return new Types.ObjectId(id)
    return null
  } catch {
    return null
  }
}

const MODEL_BY_TYPE = {
  Post,
  Storie,
  User,
  Follower: Followers,
  CloseFriend,
  Block: Blocks,
  PostLikes,
  PostComments,
  CommentLikes,
  StorieLikes,
  StorieViews,
  Report,
  BanHistory,
  DayNote,
  DayTask,
  DayEvent,
}

const getDataWithPages = async (
  { type, pipeline = [], order = "recent", following, page = 1, maxPageSize },
  mainUser
) => {
  // ---------- sanitize paging ----------
  let p = Number(page)
  let size = Number(maxPageSize)

  if (!Number.isFinite(p) || p < 1) p = 1
  if (!Number.isFinite(size) || size < 1) size = DEFAULT_MAX_PAGE_SIZE
  size = Math.min(size, DEFAULT_MAX_PAGE_SIZE)

  const skipCount = (p - 1) * size
  const mainUserId = toObjectIdOrNull(mainUser?._id)
  const basePipeline = Array.isArray(pipeline) ? [...pipeline] : []

  // ---------- FOLLOWING filter ----------
  const canApplyFollowing = type === "Post" || type === "User"

  if (canApplyFollowing && following && mainUserId) {
    const userIdField = type === "Post" ? "user_info._id" : "_id"

    if (following === "following") {
      basePipeline.push({
        $lookup: {
          from: "followers",
          let: { userId: `$${userIdField}` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followerId", mainUserId] },
                    { $eq: ["$followingId", "$$userId"] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "following_info",
        },
      })

      basePipeline.push({
        $match: { "following_info.0": { $exists: true } },
      })
    }

    if (following === "friends") {
      basePipeline.push({
        $lookup: {
          from: "followers",
          let: { userId: `$${userIdField}` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followerId", mainUserId] },
                    { $eq: ["$followingId", "$$userId"] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "following_info",
        },
      })

      basePipeline.push({
        $lookup: {
          from: "followers",
          let: { userId: `$${userIdField}` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$followingId", mainUserId] },
                    { $eq: ["$followerId", "$$userId"] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "followers_info",
        },
      })

      basePipeline.push({
        $match: {
          $and: [
            { "following_info.0": { $exists: true } },
            { "followers_info.0": { $exists: true } },
          ],
        },
      })
    }
  }

  // ---------- SORT ----------
  let sortStage
  switch (order) {
    case "relevant":
      sortStage = {
        $sort: { relevance: -1, created_at: -1, timeZoneMatch: -1, _id: -1 },
      }
      break
    case "recent_ban":
      sortStage = { $sort: { ban_date: -1, _id: -1 } }
      break
    case "recent":
    default:
      sortStage = { $sort: { created_at: -1, timeZoneMatch: -1, _id: -1 } }
      break
  }

  // ---------- MODEL ----------
  const Model = MODEL_BY_TYPE[type]
  if (!Model) throw new Error(`Invalid type: ${type}`)

  try {
    const aggregationPipeline = [
      {
        $facet: {
          data: [
            ...basePipeline,
            sortStage,
            { $skip: skipCount },
            { $limit: size },
          ],
          totalCount: [...basePipeline, { $count: "total" }],
        },
      },
      {
        $addFields: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
          },
        },
      },
    ]

    const result = await Model.aggregate(aggregationPipeline)
    const row = result?.[0] || {}
    const data = row.data || []
    const totalCount = row.totalCount || 0

    const totalPages = totalCount ? Math.ceil(totalCount / size) : 0

    return {
      data,
      page: p,
      pageSize: data.length,
      maxPageSize: size,
      totalPages,
      totalCount,
    }
  } catch (error) {
    throw new Error(error?.message || "Aggregation error")
  }
}

module.exports = getDataWithPages
