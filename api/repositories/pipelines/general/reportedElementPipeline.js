const hideUserData = require("../../hideProject/hideUserData")
const hidePostData = require("../../hideProject/hidePostData")
const hideStorieData = require("../../hideProject/hideStorieData")

const reportedElementPipeline = (type = "user") => [
  {
    // type == "user", "post" or "storie"
    $match: {
      $and: [
        {
          entity_type: type,
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
          $project:
            type == "user"
              ? hideUserData
              : type == "post"
              ? hidePostData
              : hideStorieData,
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

module.exports = reportedElementPipeline
