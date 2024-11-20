const userInfoPipeline = require("../../common/userInfoPipeline")

const getFollowingPipeline = (userId, mainUser) => [
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

module.exports = getFollowingPipeline
