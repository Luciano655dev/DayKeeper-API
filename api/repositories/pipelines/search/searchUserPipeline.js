const userValidationPipeline = require("../../common/userValidationPipeline")

const searchUserPipeline = (searchQuery, mainUser) => [
  {
    $match: { name: { $regex: new RegExp(searchQuery, "i") } },
  },
  ...userValidationPipeline(mainUser),
]

module.exports = searchUserPipeline
