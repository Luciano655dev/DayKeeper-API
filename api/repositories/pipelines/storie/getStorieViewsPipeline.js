const userValidationPipeline = require("../../common/userValidationPipeline")

const getStorieViews = (storieId, mainUser) => [
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
      as: "viewsInfo",
    },
  },
  {
    $unwind: "$viewsInfo",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ userId: "$userId" }, "$viewsInfo"],
      },
    },
  },
  ...userValidationPipeline(mainUser),
]

module.exports = getStorieViews
