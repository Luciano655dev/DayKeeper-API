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
              $and: [
                { private: true },
                { $or: [{ isFollowing: true }, { _sameUser: true }] },
              ],
            },
          ],
        },
      ],
    },
  },
]

module.exports = userValidationPipeline
