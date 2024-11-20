const userInfoPipeline = require("../../common/userInfoPipeline")

const getCloseFriendsPipeline = (mainUser) => [
  {
    $match: {
      userId: mainUser._id,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "closeFriendId",
      foreignField: "_id",
      as: "closeFriendInfo",
    },
  },
  {
    $unwind: "$closeFriendInfo",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          { closeFriendId: "$closeFriendId" },
          "$closeFriendInfo",
        ],
      },
    },
  },
  ...userInfoPipeline(mainUser),
]

module.exports = getCloseFriendsPipeline
