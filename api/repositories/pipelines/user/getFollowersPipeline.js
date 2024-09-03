const hideUserData = require("../../hideProject/hideUserData")

const getFollowersPipeline = (userId) => [
  {
    $match: {
      $and: [
        {
          followingId: userId,
        },
        {
          $or: [{ requested: false }, { requested: { $exists: false } }],
        },
      ],
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "followerId",
      foreignField: "_id",
      as: "followerInfo",
      pipeline: [
        {
          $project: hideUserData,
        },
      ],
    },
  },
  {
    $unwind: "$followerInfo",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ followerId: "$followerId" }, "$followerInfo"],
      },
    },
  },
]

module.exports = getFollowersPipeline
