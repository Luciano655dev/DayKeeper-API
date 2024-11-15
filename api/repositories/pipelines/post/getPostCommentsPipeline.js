const postValidationPipeline = require("../../common/postValidationPipeline")

const getPostCommentsPipeline = (username, posttitle, mainUser) => [
  ...postValidationPipeline(mainUser),
  {
    $match: {
      $and: [{ title: posttitle }, { "user_info.name": username }],
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
