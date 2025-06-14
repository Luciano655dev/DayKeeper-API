const storieInfoPipeline = require("../../common/storieInfoPipeline")
const mongoose = require("mongoose")

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
      view_info: false,
      like_info: false,
      block_info: false,
      isInCloseFriends: false,
    },
  },
]

module.exports = getStoriePipeline
