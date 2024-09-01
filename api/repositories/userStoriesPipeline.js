const userStoriesPipeline = (mainUser, name) => [
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
          $project: {
            password: 0,
            ban_history: 0,
            reports: 0,
            follow_requests: 0,
            blocked_users: 0,
            verified_email: 0,
            roles: 0,
            banned: 0,
            device_tokens: 0,
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
      $and: [
        { user: { $nin: mainUser.blocked_users } }, // cant be blocked
        {
          "user_info.name": name, // find by name
        },
        {
          $or: [
            // se if its private or if mainUsert is following
            { "user_info.private": false },
            {
              $and: [
                { "user_info.private": true },
                { "user_info.followers": mainUser._id },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    $project:
      mainUser.name == name
        ? {
            file: true,
            text: true,
            user: true,
            user_info: true,
            created_at: true,
            views: true,
            likes: true,
          }
        : {
            file: true,
            text: true,
            user: true,
            user_info: true,
            created_at: true,
          },
  },
]

module.exports = userStoriesPipeline
