const userInfoPipeline = require("../../common/userInfoPipeline")

const getFollowRequestsPipeline = (mainUser) => [
  {
    $match: {
      $and: [
        {
          followingId: mainUser._id,
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

module.exports = getFollowRequestsPipeline
