const hideUserData = require("../../hideProject/hideUserData")

const getFollowingPipeline = (userId) => [
  {
    $match: {
      $and: [
        {
          followerId: userId,
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

module.exports = getFollowingPipeline
