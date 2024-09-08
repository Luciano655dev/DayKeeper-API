const hideUserData = require("../../hideProject/hideUserData")

const getStorieViewsPipeline = (storieId) => [
  {
    $match: {
      storieId,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "viewsInfo",
      pipeline: [
        {
          $project: hideUserData,
        },
      ],
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
]

module.exports = getStorieViewsPipeline
