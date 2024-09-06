const hideUserData = require("../../hideProject/hideUserData")

const getCommentLikesPipeline = (commentId) => [
  {
    $match: {
      commentId,
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

module.exports = getCommentLikesPipeline
