const storieInfoPipeline = require("../../common/storieInfoPipeline")

const getStoriePipeline = (storieId, mainUser) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(storieId),
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
