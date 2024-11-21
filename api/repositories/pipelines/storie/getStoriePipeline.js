const storieInfoPipeline = require("../../common/storieInfoPipeline")

const getStoriePipeline = (userId, storieInput, mainUser) => [
  {
    $match: {
      $or: [
        {
          user: userId,
          title: storieInput,
        },
        {
          _id: { $eq: storieInput },
        },
      ],
    },
  },
  ...storieInfoPipeline(mainUser),
  {
    $project: {
      following_info: false,
      block_info: false,
      isInCloseFriends: false,
    },
  },
]

module.exports = getStoriePipeline
