const isFollowingPipeline = (mainUser) => [
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$followerId", mainUser._id] },
                { $eq: ["$followingId", "$$userId"] },
                { $ne: ["$requested", true] },
              ],
            },
          },
        },
      ],
      as: "isFollowing_relationship",
    },
  },
  {
    $project: {
      isFollowing_relationship: false,
    },
  },
]

module.exports = isFollowingPipeline
