const mongoose = require("mongoose")

const getPostLikesPipeline = (postId) => [
  {
    $match: {
      postId: new mongoose.Types.ObjectId(postId),
      status: { $ne: "deleted" },
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
