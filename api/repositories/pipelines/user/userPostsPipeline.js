const postInfoPipeline = require("../../common/postInfoPipeline")

// TODO make a sort by relevance or recent (at least duhhh)
const userPostsPipeline = (mainUser, name) => [
  ...postInfoPipeline(mainUser),
  {
    $match: {
      "user_info.name": name,
    },
  },
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

module.exports = userPostsPipeline
