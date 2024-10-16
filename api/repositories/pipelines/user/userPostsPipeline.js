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
    $lookup: {
      from: "users",
      localField: "closeFriendId",
      foreignField: "_id",
      as: "closeFriendInfo",
      pipeline: [
        {
          $project: hideUserData,
        },
      ],
    },
  },
  {
    $addFields: {
      closeFriendInfo: { $arrayElemAt: ["$closeFriendInfo", 0] },
    },
  },
  {
    $match: {
      $or: [
        { privacy: undefined },
        { privacy: "public" },
        {
          $and: [
            { privacy: "private" },
            {
              "user_info._id": mainUser._id,
            },
          ],
        },
        {
          $and: [
            { privacy: "close friends" },
            {
              $expr: { $eq: ["$closeFriendId", mainUser._id] },
            },
          ],
        },
      ],

      "user_info.name": name,
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
    $lookup: {
      from: "postComments",
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
            totalComments: { $sum: 1 },
            userCommented: {
              $push: {
                $cond: [
                  { $eq: ["$userId", mainUser._id] },
                  {
                    comment: "$comment",
                    gif: "$gif",
                    created_at: "$created_at",
                  },
                  false,
                ],
              },
            },
          },
        },
      ],
      as: "comment_info",
    },
  },
  {
    $unwind: {
      path: "$comment_info",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      likes: { $ifNull: ["$like_info.totalLikes", 0] },
      userLiked: { $gt: ["$like_info.userLiked", 0] },
      comments: { $ifNull: ["$comment_info.totalComments", 0] },
      userCommented: { $ifNull: ["$comment_info.userCommented", false] },
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
      comments: 1,
      userCommented: 1,
      user_info: 1,
    },
  },
]

module.exports = userPostsPipeline
