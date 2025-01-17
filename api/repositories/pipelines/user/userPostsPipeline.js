const postInfoPipeline = require("../../common/postInfoPipeline")

const userPostsPipeline = (mainUser, name) => [
  ...postInfoPipeline(mainUser),
  {
    $match: {
      "user_info.name": name,
    },
  },
]

module.exports = userPostsPipeline
