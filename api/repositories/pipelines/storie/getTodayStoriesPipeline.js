const storieInfoPipeline = require("../../common/storieInfoPipeline")

const getTodayStoriesPipeline = (userId, startOfDay, endOfDay, mainUser) => [
  {
    $match: {
      $and: [
        { user: userId },
        {
          created_at: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      ],
    },
  },
  ...storieInfoPipeline(mainUser),
  {
    $project: {
      following_info: false,
      view_info: false,
      like_info: false,
      block_info: false,
      isInCloseFriends: false,
    },
  },
]

module.exports = getTodayStoriesPipeline
