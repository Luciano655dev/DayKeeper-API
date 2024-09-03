const getFollowingPipeline = (userId) => [
  {
    $match: {
      $and: [
        {
          followerId: userId,
        },
        {
          $or: [{ requested: false }, { requested: { $exists: false } }],
        },
      ],
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "followerId",
      foreignField: "_id",
      as: "followerInfo",
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
    $unwind: "$followerInfo",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ followerId: "$followerId" }, "$followerInfo"],
      },
    },
  },
]

module.exports = getFollowingPipeline
