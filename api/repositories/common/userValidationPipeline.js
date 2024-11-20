const isFollowingPipeline = require("./user/isFollowingPipeline")

const userValidationPipeline = (mainUser) => [
  ...isFollowingPipeline(mainUser),
  {
    $match: {
      $and: [
        { banned: { $ne: true } },
        {
          $or: [
            { private: false },
            {
              $and: [
                { private: true },
                { $expr: { $gt: [{ $size: "$isFollowing_relationship" }, 0] } },
              ],
            },
          ],
        },
      ],
    },
  },
]

module.exports = userValidationPipeline
