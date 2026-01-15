const hideUserData = require("../../hideProject/hideUserData")
const hidePostData = require("../../hideProject/hidePostData")

const banHistoryMadeByAdmin = (userId, type = "user") => [
  {
    // type == "user", "post"
    $match: {
      $and: [
        {
          entity_type: type,
        },
        {
          banned_by: userId,
        },
      ],
    },
  },
  {
    $lookup: {
      from: `${type}s`,
      localField: "entity_id",
      foreignField: "_id",
      as: "entity_info",
      pipeline: [
        {
          $project: type == "users" ? hideUserData : hidePostData,
        },
      ],
    },
  },
  {
    $unwind: "$entity_info",
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ entity_id: "$entity_id" }, "$entity_info"],
      },
    },
  },
]

module.exports = banHistoryMadeByAdmin
