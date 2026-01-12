const userInfoPipeline = require("../../common/userInfoPipeline")

const searchUserPipeline = (searchQuery, mainUser) => [
  {
    $match: { username: { $regex: new RegExp(searchQuery, "i") } },
  },
  ...userInfoPipeline(mainUser),
]

module.exports = searchUserPipeline
