const hideUserData = require("../../hideProject/hideUserData")

const getPostLikesPipeline = (postId) => [
  {
    $match: {
      postId,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "likesInfo",
      pipeline: [
        {
          $project: hideUserData,
        },
      ],
    },
  },
  {
    $unwind: "$likesInfo",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ userId: "$userId" }, "$likesInfo"],
      },
    },
  },
]

module.exports = getPostLikesPipeline
