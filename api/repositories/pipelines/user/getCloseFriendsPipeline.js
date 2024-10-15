const hideUserData = require("../../hideProject/hideUserData")

const getCloseFriendsPipeline = (userId) => [
  {
    $match: {
      userId,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "closeFriendId",
      foreignField: "_id",
      as: "closeFriendInfo",
      pipeline: [
        {
          $project: hideUserData,
        },
      ],
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
]

module.exports = getCloseFriendsPipeline
