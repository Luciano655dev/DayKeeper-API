const userValidationPipeline = require("../../common/userValidationPipeline")

const getStorieLikesPipeline = (storieId, mainUser) => [
  {
    $match: {
      storieId,
      storieUserId: mainUser._id,
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
  ...userValidationPipeline(mainUser),
]

module.exports = getStorieLikesPipeline
