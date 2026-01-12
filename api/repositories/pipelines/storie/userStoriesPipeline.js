const storieInfoPipeline = require("../../common/storieInfoPipeline")

const userStoriesPipeline = (username, mainUser) => [
  {
    $lookup: {
      from: "users",
      let: { userId: { $toObjectId: "$user" } },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$userId"] },
          },
        },
      ],
      as: "user_info",
    },
  },
  {
    $addFields: {
      user_info: { $arrayElemAt: ["$user_info", 0] },
    },
  },
  {
    $match: {
      "user_info.username": username,
      user: mainUser._id,
    },
  },
  ...storieInfoPipeline(mainUser),
]

module.exports = userStoriesPipeline
