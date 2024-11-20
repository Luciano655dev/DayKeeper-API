const isFollowingPipeline = require("./isFollowingPipeline")

const followInfoPipeline = (mainUser) => [
  // ._id
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$followingId", "$$userId"] } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
          },
        },
      ],
      as: "followersCount",
    },
  },
  {
    $unwind: {
      path: "$followersCount",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$followerId", "$$userId"] } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
          },
        },
      ],
      as: "followingCount",
    },
  },
  {
    $unwind: {
      path: "$followingCount",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "followers",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                {
                  $and: [
                    { $eq: ["$followerId", "$$userId"] },
                    { $eq: ["$followingId", mainUser._id] },
                    { $ne: ["$requested", true] },
                  ],
                },
                {
                  $and: [
                    { $eq: ["$followerId", mainUser._id] },
                    { $eq: ["$followingId", "$$userId"] },
                    { $ne: ["$requested", true] },
                  ],
                },
              ],
            },
          },
        },
      ],
      as: "follow_relationships",
    },
  },
  ...isFollowingPipeline(mainUser),
  {
    $addFields: {
      followers: { $ifNull: ["$followersCount.total", 0] },
      following: { $ifNull: ["$followersCount.total", 0] },
      follow_info: {
        $switch: {
          branches: [
            {
              case: {
                $expr: {
                  $and: [
                    {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: "$follow_relationships",
                              as: "rel",
                              cond: { $eq: ["$$rel.followerId", mainUser._id] },
                            },
                          },
                        },
                        0,
                      ],
                    },
                    {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: "$follow_relationships",
                              as: "rel",
                              cond: {
                                $eq: ["$$rel.followingId", mainUser._id],
                              },
                            },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
              then: "friends",
            },
            {
              case: {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$follow_relationships",
                          as: "rel",
                          cond: { $eq: ["$$rel.followerId", mainUser._id] },
                        },
                      },
                    },
                    0,
                  ],
                },
              },
              then: "follower",
            },
            {
              case: {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: "$follow_relationships",
                          as: "rel",
                          cond: { $eq: ["$$rel.followingId", mainUser._id] },
                        },
                      },
                    },
                    0,
                  ],
                },
              },
              then: "following",
            },
          ],
          default: null,
        },
      },
    },
  },
  {
    $project: {
      follow_relationships: false,
      isFollowing_relationship: false,
      followersCount: false,
      followingCount: false,
    },
  },
]

module.exports = followInfoPipeline
