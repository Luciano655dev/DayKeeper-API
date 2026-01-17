const userValidationPipeline = () => [
  {
    $match: {
      $and: [
        { banned: { $ne: true } },
        { status: "public" },
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
