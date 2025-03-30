const storieInfoPipeline = require("../../common/storieInfoPipeline")
const mongoose = require("mongoose")

const getTodayStoriesPipeline = (userId, startOfDay, endOfDay, mainUser) => [
  {
    $match: {
      $and: [
        { user: new mongoose.Types.ObjectId(userId) },
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
