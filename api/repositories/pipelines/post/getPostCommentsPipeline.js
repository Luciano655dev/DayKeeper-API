const postValidationPipeline = require("../../common/postValidationPipeline")
const mongoose = require("mongoose")

const getPostCommentsPipeline = (postId, mainUser) => [
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
      as: "commentsInfo",
    },
  },
  {
    $unwind: "$commentsInfo",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            user: "$commentsInfo",
            comment: "$comment",
            gif: "$gif",
            created_at: "$created_at",
          },
        ],
      },
    },
  },
]

module.exports = getPostCommentsPipeline
