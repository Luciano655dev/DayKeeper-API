const mongoose = require("mongoose")
const storieInfoPipeline = require("../../common/storieInfoPipeline")

const getFollowingStoriesPipeline = (mainUserId, startOfDay, endOfDay) => [
  {
    $lookup: {
      from: "followers",
      let: { storieUserId: "$user" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ["$followerId", new mongoose.Types.ObjectId(mainUserId)],
                },
                { $eq: ["$followingId", "$$storieUserId"] },
                {
                  $or: [
                    { $eq: ["$requested", false] },
                    { $eq: ["$requested", null] },
                    { $not: { $ifNull: ["$requested", false] } },
                  ],
                },
              ],
            },
          },
        },
      ],
      as: "follow_check",
    },
  },

  {
    $match: {
      follow_check: { $ne: [] },
      created_at: { $gte: startOfDay, $lte: endOfDay },
    },
  },

  ...storieInfoPipeline(mainUserId),

  {
    $project: {
      follow_check: false,
      following_info: false,
      view_info: false,
      like_info: false,
      block_info: false,
      isInCloseFriends: false,
    },
  },
]

module.exports = getFollowingStoriesPipeline
