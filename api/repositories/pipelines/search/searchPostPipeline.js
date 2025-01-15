const postInfoPipeline = require("../../common/postInfoPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../constants/index")

const searchPostPipeline = (searchQuery, mainUser) => [
  ...postInfoPipeline(mainUser),
  {
    $match: {
      $or: [
        { created_at: { $regex: new RegExp(searchQuery, "i") } },
        { "user_info.name": { $regex: new RegExp(searchQuery, "i") } },
      ],
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
      string_created_at: 1,
    },
  },
]

module.exports = searchPostPipeline
