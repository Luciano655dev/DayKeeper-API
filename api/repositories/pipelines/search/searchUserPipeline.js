const userInfoPipeline = require("../../common/userInfoPipeline")

const searchUserPipeline = (searchQuery, mainUser) => [
  {
    $match: { name: { $regex: new RegExp(searchQuery, "i") } },
  },
  ...userInfoPipeline(mainUser),
]

module.exports = searchUserPipeline
