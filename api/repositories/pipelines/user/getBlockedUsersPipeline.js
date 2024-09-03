const hideUserData = require("../../hideProject/hideUserData")

const getBlockedUsersPipeline = (userId) => [
  {
    $match: {
      blockId: userId,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "blockedId",
      foreignField: "_id",
      as: "blockedInfo",
      pipeline: [
        {
          $project: hideUserData,
        },
      ],
    },
  },
  {
    $unwind: "$blockedInfo",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ blockedId: "$blockedId" }, "$blockedInfo"],
      },
    },
  },
]

module.exports = getBlockedUsersPipeline
