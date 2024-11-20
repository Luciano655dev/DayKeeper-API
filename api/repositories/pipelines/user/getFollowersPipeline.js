const userInfoPipeline = require("../../common/userInfoPipeline")

const getFollowersPipeline = (userId, mainUser) => [
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
  ...userInfoPipeline(mainUser),
]

module.exports = getFollowersPipeline
