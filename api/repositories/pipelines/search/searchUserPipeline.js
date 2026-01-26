const userInfoPipeline = require("../../common/userInfoPipeline")

const searchUserPipeline = (searchQuery, mainUser) => [
  {
    $match: {
      $or: [
        { username: { $regex: new RegExp(searchQuery, "i") } },
        {
          displayName: { $regex: new RegExp(searchQuery, "i") },
        },
      ],
    },
  },
  ...userInfoPipeline(mainUser, { allowPrivate: true }),
]

module.exports = searchUserPipeline
