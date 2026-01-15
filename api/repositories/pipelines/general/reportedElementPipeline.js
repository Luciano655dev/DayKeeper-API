const hideUserData = require("../../hideProject/hideUserData")
const hidePostData = require("../../hideProject/hidePostData")

const reportedElementPipeline = (type = "user") => [
  {
    $lookup: {
      from: `${type}s`,
      localField: "referenceId",
      foreignField: "_id",
      as: "entity_info",
      pipeline: [
        {
          $project: type === "user" ? hideUserData : hidePostData,
        },
      ],
    },
  },
  { $unwind: "$entity_info" },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ referenceId: "$referenceId" }, "$entity_info"],
      },
    },
  },
]

module.exports = reportedElementPipeline
