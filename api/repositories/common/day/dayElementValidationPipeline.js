const hideUserData = require("../../hideProject/hideUserData")

const dayElementValidationPipeline = (mainUser) => [
  {
    $lookup: {
      from: "users",
      let: { userId: "$user" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
        { $project: hideUserData },
      ],
      as: "user_info",
    },
  },
  { $unwind: { path: "$user_info", preserveNullAndEmptyArrays: false } },

  // following relationship
  {
    $lookup: {
      from: "followers",
      let: { eventUserId: "$user_info._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$followerId", mainUser._id] },
                { $eq: ["$followingId", "$$eventUserId"] },
              ],
            },
          },
        },
        { $project: { _id: 1 } },
      ],
      as: "following_info",
    },
  },

  // block relationship
  {
    $lookup: {
      from: "blocks",
      let: { eventUserId: "$user_info._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$blockId", mainUser._id] },
                { $eq: ["$blockedId", "$$eventUserId"] },
              ],
            },
          },
        },
        { $project: { _id: 1 } },
      ],
      as: "block_info",
    },
  },

  // close friends relationship
  {
    $lookup: {
      from: "closeFriends",
      let: { eventUserId: "$user_info._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$eventUserId"] },
                { $eq: ["$closeFriendId", mainUser._id] },
              ],
            },
          },
        },
        { $project: { _id: 1 } },
      ],
      as: "isInCloseFriends",
    },
  },

  // access control
  {
    $match: {
      $and: [
        { "block_info.0": { $exists: false } },
        { "user_info.banned": { $ne: true } },

        {
          $or: [
            { $or: [{ privacy: "public" }, { privacy: { $exists: false } }] },
            {
              $and: [{ privacy: "private" }, { "user_info._id": mainUser._id }],
            },
            {
              $and: [
                { privacy: "close friends" }, // change to "close_friends" if you normalize
                { "isInCloseFriends.0": { $exists: true } },
              ],
            },
          ],
        },

        {
          $or: [
            { "user_info.private": false },
            { "following_info.0": { $exists: true } },
          ],
        },
      ],
    },
  },
]

module.exports = dayElementValidationPipeline
