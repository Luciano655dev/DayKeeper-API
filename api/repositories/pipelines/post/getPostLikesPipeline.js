const postValidationPipeline = require("../../common/postValidationPipeline")

const getPostLikesPipeline = (username, posttitle, mainUser) => [
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
