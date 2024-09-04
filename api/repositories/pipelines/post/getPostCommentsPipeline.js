const hideUserData = require("../../hideProject/hideUserData")

const getPostCommentsPipeline = (postId) => [
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
      as: "commentsInfo",
      pipeline: [
        {
          $project: hideUserData,
        },
      ],
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
