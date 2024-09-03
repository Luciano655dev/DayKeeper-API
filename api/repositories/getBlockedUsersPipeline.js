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
          $project: {
            password: 0,
            ban_history: 0,
            reports: 0,
            verified_email: 0,
            roles: 0,
            banned: 0,
          },
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
