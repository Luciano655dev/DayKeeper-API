const userValidationPipeline = () => [
  {
    $match: {
      $and: [
        { banned: { $ne: true } },
        {
          $or: [
            { private: false },
            {
              $and: [{ private: true }, { isFollowing: true }],
            },
          ],
        },
      ],
    },
  },
]

module.exports = userValidationPipeline
