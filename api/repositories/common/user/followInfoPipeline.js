const followInfoPipeline = (mainUser) => {
  return [
    {
      $lookup: {
        from: "followers",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ["$requested", true] },
                  {
                    $or: [
                      { $eq: ["$followingId", "$$userId"] }, // followers of user
                      { $eq: ["$followerId", "$$userId"] }, // following of user
                    ],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              followerId: 1,
              followingId: 1,
            },
          },
        ],
        as: "_followRels",
      },
    },

    // counts
    {
      $addFields: {
        followers: {
          $size: {
            $filter: {
              input: "$_followRels",
              as: "r",
              cond: { $eq: ["$$r.followingId", "$_id"] },
            },
          },
        },
        following: {
          $size: {
            $filter: {
              input: "$_followRels",
              as: "r",
              cond: { $eq: ["$$r.followerId", "$_id"] },
            },
          },
        },
      },
    },

    // relationship booleans
    {
      $addFields: {
        _followByMe: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: "$_followRels",
                  as: "r",
                  cond: {
                    $and: [
                      { $eq: ["$$r.followerId", mainUser._id] },
                      { $eq: ["$$r.followingId", "$_id"] },
                    ],
                  },
                },
              },
            },
            0,
          ],
        },
        _followsMe: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: "$_followRels",
                  as: "r",
                  cond: {
                    $and: [
                      { $eq: ["$$r.followerId", "$_id"] },
                      { $eq: ["$$r.followingId", mainUser._id] },
                    ],
                  },
                },
              },
            },
            0,
          ],
        },
      },
    },

    // keep your public fields
    {
      $addFields: {
        isFollowing: "$_followByMe",

        follow_info: {
          $switch: {
            branches: [
              {
                case: { $and: ["$_followByMe", "$_followsMe"] },
                then: "friends",
              },
              {
                // keep same naming you had: if I follow them -> "follower"
                case: "$_followByMe",
                then: "follower",
              },
              {
                // if they follow me -> "following"
                case: "$_followsMe",
                then: "following",
              },
            ],
            default: null,
          },
        },
      },
    },

    // cleanup temp fields
    {
      $project: {
        _followRels: 0,
        _followByMe: 0,
        _followsMe: 0,
      },
    },
  ]
}

module.exports = followInfoPipeline
