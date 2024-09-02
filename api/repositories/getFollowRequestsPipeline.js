const getFollowRequestsPipeline = (userId) => [
  {
    $match: {
      $and: [
        {
          followingId: userId,
        },
        {
          requested: true,
        },
      ],
    },
  },
]

module.exports = getFollowRequestsPipeline
