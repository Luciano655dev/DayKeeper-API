const hideUserData = require("../../hideProject/hideUserData")

const getFollowRequestsPipeline = (userId) => [
  {
    $match: {
      $and: [
        {
          followingId: userId,
        },
        {
          requested: true,
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

module.exports = getFollowRequestsPipeline
