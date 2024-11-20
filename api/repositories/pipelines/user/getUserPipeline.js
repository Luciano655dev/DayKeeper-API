const userInfoPipeline = require("../../common/userInfoPipeline")

const getUserPipeline = (username, mainUser) => [
  {
    $match: {
      name: username,
    },
  },
  ...userInfoPipeline(mainUser),
]

module.exports = getUserPipeline
