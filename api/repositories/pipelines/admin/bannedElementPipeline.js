const hideUserData = require("../../hideProject/hideUserData")
const hidePostData = require("../../hideProject/hidePostData")

const bannedElementPipeline = (loggedUserId, type = "user") => [
  {
    // type == "user", "post"
    $match: {
      $and: [
        {
          entity_type: type,
        },
        {
          action_type: "ban",
        },
        {
          banned_by: loggedUserId,
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

module.exports = bannedElementPipeline
