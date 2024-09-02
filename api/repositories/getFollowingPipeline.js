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
    $project: {
      requested: false,
    },
  },
]

module.exports = getFollowingPipeline
