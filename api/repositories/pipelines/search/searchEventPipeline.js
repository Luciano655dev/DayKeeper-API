const hideUserData = require("../../hideProject/hideUserData")
const { format, parse } = require("date-fns")

const searchEventPipeline = (searchQuery, userId, filter) => {
  const searchDate = format(
    parse(`${searchQuery}`, "dd-MM-yyyy", new Date()),
    "dd-MM-yyyy"
  )

  let filterPipe = {}
  switch (filter) {
    case "upcoming":
      filterPipe = { timeStart: { $gt: new Date() } }
      break
    case "past":
      filterPipe = { timeStart: { $lt: new Date() } }
      break
    case "ongoing":
      filterPipe = {
        $and: [
          { timeStart: { $lt: new Date() } },
          { timeEnd: { $gt: new Date() } },
        ],
      }
      break
    default:
      break
  }

  return [
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
          {
            $project: hideUserData,
          },
        ],
        as: "user_info",
      },
    },
    {
      $unwind: "$user_info",
    },
    {
      $lookup: {
        from: "followers",
        let: { followingId: "$user_info._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followerId", userId] },
                  { $eq: ["$followingId", "$$followingId"] },
                ],
              },
            },
          },
        ],
        as: "following_info",
      },
    },
    {
      $lookup: {
        from: "blocks",
        let: { blockedId: "$user_info._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$blockId", userId] },
                  { $eq: ["$blockedId", "$$blockedId"] },
                ],
              },
            },
          },
        ],
        as: "block_info",
      },
    },
    {
      $match: {
        $and: [
          { "block_info.0": { $exists: false } },
          { "user_info.banned": { $ne: true } },
          {
            $or: [
              { "user_info._id": userId },
              {
                $and: [
                  { "user_info.private": false },
                  {
                    $and: [
                      { "user_info.private": true },
                      { "following_info.0": { $exists: true } },
                    ],
                  },
                ],
              },
            ],
          },

          filterPipe,
          { "user_info._id": userId },
          {
            date: {
              $regex: new RegExp(searchDate, "i"),
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        date: 1,
        timeStart: 1,
        timeEnd: 1,
        location: 1,
        user: 1,
        user_info: 1,
        created_at: 1,
      },
    },
  ]
}

module.exports = searchEventPipeline
