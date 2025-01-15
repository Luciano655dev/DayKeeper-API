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
  {
    $project: {
      _id: 1,
      title: 1,
      data: 1,
      user: 1,
      files: 1,
      created_at: 1,
      likes: 1,
      userLiked: 1,
      comments: 1,
      userCommented: 1,
      user_info: 1,
    },
  },
]

module.exports = getPostPipeline
