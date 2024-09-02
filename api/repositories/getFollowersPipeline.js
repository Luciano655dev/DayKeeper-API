const getFollowersPipeline = (userId) => [
  {
    $match: {
      $and: [
        {
          followingId: userId,
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

module.exports = getFollowersPipeline
