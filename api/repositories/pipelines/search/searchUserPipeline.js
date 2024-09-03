const hideUserData = require("../../hideProject/hideUserData")

const searchUserPipeline = (searchQuery, mainUser) => [
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
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
    $match: {
      $and: [
        { "block_info.0": { $exists: false } },
        { banned: { $ne: true } },
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          $or: [
            { private: false },
            {
              $and: [
                { private: true },
                { "following_info.0": { $exists: true } },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    $project: hideUserData,
  },
]

module.exports = searchUserPipeline
