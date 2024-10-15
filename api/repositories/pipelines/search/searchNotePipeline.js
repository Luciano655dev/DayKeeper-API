const hideUserData = require("../../hideProject/hideUserData")

const searchNotePipeline = (searchQuery, userId, filter) => {
  let filterPipe = {}
  switch (filter) {
    case "upcoming":
      filterPipe = {
        $expr: {
          $gt: [
            {
              $dateFromString: {
                dateString: "$date",
                format: "%d-%m-%Y",
              },
            },
            new Date(), // Data atual
          ],
        },
      }
      break
    case "past":
      filterPipe = {
        $expr: {
          $lt: [
            {
              $dateFromString: {
                dateString: "$date",
                format: "%d-%m-%Y",
              },
            },
            new Date(), // Data atual
          ],
        },
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
      $lookup: {
        from: "users",
        localField: "closeFriendId",
        foreignField: "_id",
        as: "closeFriendInfo",
        pipeline: [
          {
            $project: hideUserData,
          },
        ],
      },
    },
    {
      $addFields: {
        closeFriendInfo: { $arrayElemAt: ["$closeFriendInfo", 0] },
      },
    },
    {
      $match: {
        $or: [
          { privacy: undefined },
          { privacy: "public" },
          {
            $and: [
              { privacy: "private" },
              {
                "user_info._id": userId,
              },
            ],
          },
          {
            $and: [
              { privacy: "close friends" },
              {
                $expr: { $eq: ["$closeFriendId", userId] },
              },
            ],
          },
        ],

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
            $or: [
              {
                date: {
                  $regex: new RegExp(searchQuery, "i"),
                },
              },
              {
                text: {
                  $regex: new RegExp(searchQuery, "i"),
                },
              },
            ],
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        text: 1,
        date: 1,
        user: 1,
        user_info: 1,
        created_at: 1,
      },
    },
  ]
}

module.exports = searchNotePipeline
