const postValidationPipeline = (mainUser) => [
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
      from: "users",
      localField: "closeFriendId",
      foreignField: "_id",
      as: "closeFriendInfo",
    },
  },
  {
    $addFields: {
      closeFriendInfo: { $arrayElemAt: ["$closeFriendInfo", 0] },
    },
  },
  {
    $match: {
      $and: [
        { "block_info.0": { $exists: false } },
        { "user_info.banned": { $ne: true } },
        {
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
]

module.exports = postValidationPipeline
