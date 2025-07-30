const postInfoPipeline = require("../../common/postInfoPipeline")
const mongoose = require("mongoose")

const getPostPipeline = (postId, mainUser) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(postId),
    },
  },
  ...postInfoPipeline(mainUser),
]

module.exports = getPostPipeline
