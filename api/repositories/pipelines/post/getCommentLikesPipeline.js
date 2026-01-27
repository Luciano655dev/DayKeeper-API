const mongoose = require("mongoose")

const getCommentLikesPipeline = (commentId) => [
  {
    $lookup: {
      from: "postComments",
      localField: "commentId",
      foreignField: "_id",
      as: "comment_info",
    },
  },
  {
    $unwind: "$comment_info",
  },
  {
    $lookup: {
      from: "users",
      localField: "comment_info.userId",
      foreignField: "_id",
      as: "commentAuthor",
    },
  },
  {
    $unwind: "$commentAuthor",
  },
  {
    $match: {
      commentId: new mongoose.Types.ObjectId(commentId),
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
        $mergeObjects: [
          { userId: "$userId" },
          "$likesInfo",
          { commentAuthor: "$commentAuthor" },
          { comment: "$comment_info" },
        ],
      },
    },
  },
]

module.exports = getCommentLikesPipeline
