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
                  { $ne: ["$status", "deleted"] },
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

    // relationship booleans + same user
    {
      $addFields: {
        _sameUser: { $eq: ["$_id", mainUser._id] },

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
        // if it's me, force false so UI doesn't show "Following" on myself
        isFollowing: {
          $cond: ["$_sameUser", false, "$_followByMe"],
        },

        follow_info: {
          $switch: {
            branches: [
              {
                case: "$_sameUser",
                then: "same_user",
              },
              {
                case: { $and: ["$_followByMe", "$_followsMe"] },
                then: "friends",
              },
              {
                // if I follow them -> "follower"
                case: "$_followByMe",
                then: "follower",
              },
              {
                // if I requested to follow a private user
                case: { $and: ["$private", "$_requestedByMe"] },
                then: "requested",
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

    // pending follow request sent by me
    {
      $lookup: {
        from: "followers",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$requested", true] },
                  { $ne: ["$status", "deleted"] },
                  { $eq: ["$followerId", mainUser._id] },
                  { $eq: ["$followingId", "$$userId"] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "_requestedByMeInfo",
      },
    },
    {
      $addFields: {
        _requestedByMe: { $gt: [{ $size: "$_requestedByMeInfo" }, 0] },
      },
    },

    // cleanup temp fields
    {
      $project: {
        _followRels: 0,
        _followByMe: 0,
        _followsMe: 0,
        _requestedByMe: 0,
        _requestedByMeInfo: 0,
      },
    },
  ]
}

module.exports = followInfoPipeline
