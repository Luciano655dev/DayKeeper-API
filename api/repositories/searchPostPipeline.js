const searchPostPipeline = (searchQuery, mainUser, todayDate) => [
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
            verified_email: 0,
            roles: 0,
            banned: 0,
          },
        },
      ],
      as: "user_info",
    },
  },
  {
    $unwind: "$user_info",
  }, // Garantir que estamos lidando com um único usuário após o $lookup
  {
    $lookup: {
      from: "followers",
      let: { followingId: "$user_info._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$followerId", mainUser._id] },
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
                { $eq: ["$blockId", mainUser._id] },
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
        { "user_info.banned": { $ne: "true" } },
        {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { "user_info.name": { $regex: new RegExp(searchQuery, "i") } },
          ],
        },
        {
          $or: [
            { "user_info.private": false },
            {
              $and: [
                { "user_info.private": true },
                { "following_info.0": { $exists: true } }, // Verifica se o usuário principal está seguindo o usuário privado
              ],
            },
          ],
        },
      ],
    },
  },
  {
    $addFields: {
      relevance: { $sum: ["$likes", { $size: "$comments" }] },
      isToday: { $eq: ["$title", todayDate] },
    },
  },
  {
    $project: {
      _id: 1,
      title: 1,
      data: 1,
      user: 1,
      files: 1,
      created_at: 1,
      likes: 1,
      comments: { $size: "$comments" },
      user_info: 1,
      following_info: 0, // Exclui o campo following_info do resultado final
    },
  },
]

module.exports = searchPostPipeline
