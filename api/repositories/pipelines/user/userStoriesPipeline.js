const hideUserData = require("../../hideProject/hideUserData")

const userStoriesPipeline = (mainUser, name) => [
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

      $and: [
        { user: { $ne: mainUser.blocked_users } }, // cant be blocked
        {
          "user_info.name": name, // find by name
        },
        {
          $or: [
            // se if its private or if mainUsert is following
            { "user_info.private": false },
            {
              $and: [
                { "user_info.private": true },
                { "user_info.followers": mainUser._id },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    $project:
      mainUser.name == name
        ? {
            file: true,
            text: true,
            user: true,
            user_info: true,
            created_at: true,
            views: true,
          }
        : {
            file: true,
            text: true,
            user: true,
            user_info: true,
            created_at: true,
          },
  },
]

module.exports = userStoriesPipeline
