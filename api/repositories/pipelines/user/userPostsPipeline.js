const hideUserData = require("../../hideProject/hideUserData")

const userPostsPipeline = (mainUser, name) => [
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
    $addFields: {
      user_info: { $arrayElemAt: ["$user_info", 0] },
    },
  },
  {
    $match: { "user_info.name": name },
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
    $addFields: {
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

module.exports = userPostsPipeline
