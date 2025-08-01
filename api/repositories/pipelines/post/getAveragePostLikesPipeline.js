const mongoose = require("mongoose")

const getAveragePostLikesPipeline = (userId) => [
  {
    $match: { userPostId: new mongoose.Types.ObjectId(userId) },
  },
  {
    $group: {
      _id: "$postId",
      likeCount: { $sum: 1 },
    },
  },
  {
    $group: {
      _id: null,
      totalLikes: { $sum: "$likeCount" },
      totalPosts: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      data: {
        $cond: [
          { $eq: ["$totalPosts", 0] },
          0,
          { $divide: ["$totalLikes", "$totalPosts"] },
        ],
      },
    },
  },
]

module.exports = getAveragePostLikesPipeline
