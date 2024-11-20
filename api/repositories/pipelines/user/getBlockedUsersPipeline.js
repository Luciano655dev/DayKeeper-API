const userInfoPipeline = require("../../common/userInfoPipeline")

const getBlockedUsersPipeline = (mainUser) => [
  {
    $match: {
      blockId: mainUser._id,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "blockedId",
      foreignField: "_id",
      as: "blockedInfo",
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
  ...userInfoPipeline(mainUser),
]

module.exports = getBlockedUsersPipeline
