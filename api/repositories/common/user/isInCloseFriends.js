const isInCloseFriends = (mainUser) => [
  {
    $lookup: {
      from: "closeFriends",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", mainUser._id] },
                { $eq: ["$closeFriendId", "$$userId"] },
              ],
            },
          },
        },
        { $limit: 1 }, // optimization
      ],
      as: "_closeFriendMatch",
    },
  },
  {
    $addFields: {
      isInCloseFriends: {
        $gt: [{ $size: "$_closeFriendMatch" }, 0],
      },
    },
  },
  {
    $project: {
      _closeFriendMatch: 0,
    },
  },
]

module.exports = isInCloseFriends
