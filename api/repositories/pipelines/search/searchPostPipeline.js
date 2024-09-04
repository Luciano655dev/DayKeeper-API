const hideUserData = require("../../hideProject/hideUserData")

const searchPostPipeline = (searchQuery, mainUser, todayDate) => [
  {
    $lookup: {
      from: "users",
      let: { userId: { $toObjectId: "$user" } },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$userId"] },
          },
        },
        {
          $project: hideUserData,
        },
      ],
      as: "user_info",
    },
  },
  {
    $unwind: "$user_info",
  },
  {
    $lookup: {
      from: "followers",
      let: { followingId: "$user_info._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$followerId", mainUser._id] },
                { $eq: ["$followingId", "$$followingId"] },
              ],
            },
          },
        },
      ],
      as: "following_info",
    },
  },
  {
    $lookup: {
      from: "blocks",
      let: { blockedId: "$user_info._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$blockId", mainUser._id] },
                { $eq: ["$blockedId", "$$blockedId"] },
              ],
            },
          },
        },
      ],
      as: "block_info",
    },
  },
  {
    $lookup: {
      from: "postLikes",
      let: { postId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$postId", "$$postId"] },
          },
        },
        {
          $group: {
            _id: null,
            totalLikes: { $sum: 1 },
            userLiked: {
              $sum: {
                $cond: [{ $eq: ["$userId", mainUser._id] }, 1, 0],
              },
            },
          },
        },
      ],
      as: "like_info",
    },
  },
  {
    $unwind: {
      path: "$like_info",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $match: {
      $and: [
        { "block_info.0": { $exists: false } },
        { "user_info.banned": { $ne: "true" } },
        {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { "user_info.name": { $regex: new RegExp(searchQuery, "i") } },
          ],
        },
        {
          $or: [
            { "user_info.private": false },
            {
              $and: [
                { "user_info.private": true },
                { "following_info.0": { $exists: true } },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    $addFields: {
      relevance: { $sum: ["$like_info.totalLikes", { $size: "$comments" }] },
      isToday: { $eq: ["$title", todayDate] },
      likes: { $ifNull: ["$like_info.totalLikes", 0] },
      userLiked: { $gt: ["$like_info.userLiked", 0] },
    },
  },
  {
    $project: {
      _id: 1,
      title: 1,
      data: 1,
      user: 1,
      files: 1,
      created_at: 1,
      likes: 1,
      userLiked: 1,
      comments: { $size: "$comments" },
      user_info: 1,
    },
  },
]

module.exports = searchPostPipeline
