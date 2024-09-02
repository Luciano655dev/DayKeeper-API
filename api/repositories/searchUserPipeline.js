const searchUserPipeline = (searchQuery, mainUser) => [
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$followerId", mainUser._id] },
                { $eq: ["$followingId", "$$userId"] },
              ],
            },
          },
        },
      ],
      as: "following_info",
    },
  },
  {
    $match: {
      $and: [
        { _id: { $nin: mainUser.blocked_users } },
        { banned: { $ne: true } },
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          $or: [
            { private: false },
            {
              $and: [
                { private: true },
                { "following_info.0": { $exists: true } },
              ],
            },
          ],
        },
      ],
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
      following_info: 0,
    },
  },
]

module.exports = searchUserPipeline
