const postInfoPipeline = require("../../common/postInfoPipeline")
const postValidationPipeline = require("../../common/postValidationPipeline")
const mongoose = require("mongoose")

const getPostPipeline = (postId, mainUser) => [
  {
    $match: {
      _id: postId,
    },
  },
  ...postInfoPipeline(mainUser),
]

module.exports = getPostPipeline
