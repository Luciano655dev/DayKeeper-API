const postInfoPipeline = require("../../common/postInfoPipeline")
const postValidationPipeline = require("../../common/postValidationPipeline")
const mongoose = require("mongoose")

const getPostPipeline = (postId, mainUser) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(postId),
    },
  },
  ...postValidationPipeline(mainUser),
  ...postInfoPipeline(mainUser),
]

module.exports = getPostPipeline
