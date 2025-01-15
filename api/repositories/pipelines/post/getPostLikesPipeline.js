const mongoose = require("mongoose")

const getPostLikesPipeline = (postId) => [
  {
    $match: {
      postId: new mongoose.Types.ObjectId(postId),
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "likesInfo",
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
