const postInfoPipeline = require("../../common/postInfoPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../constants/index")

const searchPostPipeline = (searchQuery, mainUser) => [
  ...postInfoPipeline(mainUser),
  {
    $match: {
      $or: [
        { date: { $regex: new RegExp(searchQuery, "i") } },
        { "user_info.name": { $regex: new RegExp(searchQuery, "i") } },
      ],
    },
  },
]

module.exports = searchPostPipeline
