const postValidationPipeline = (mainUser) => [
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
      ],
      as: "user_info",
    },
  },
  {
    $unwind: "$user_info",
  },
  {
    $lookup: {
      from: "media",
      let: { mediaIds: "$media" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$mediaIds",
                        as: "id",
                        in: { $toObjectId: "$$id" },
                      },
                    },
                  ],
                },
                { $eq: ["$status", "public"] },
              ],
            },
          },
        },
      ],
      as: "media",
    },
  },
  {
    $unwind: "$media",
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
    $lookup: {
      from: "closeFriends",
      let: { postUserId: "$user_info._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$postUserId"] },
                { $eq: ["$closeFriendId", mainUser._id] },
              ],
            },
          },
        },
      ],
      as: "isInCloseFriends",
    },
  },
  {
    $match: {
      $and: [
        { "block_info.0": { $exists: false } },
        { "user_info.banned": { $ne: true } },
        { "media.status": "public" },
        { status: "public" },

        {
          $or: [
            { $or: [{ privacy: "public" }, { privacy: { $exists: false } }] },
            {
              $and: [{ privacy: "private" }, { "user_info._id": mainUser._id }],
            },
            {
              $and: [
                { privacy: "close friends" },
                { "isInCloseFriends.0": { $exists: true } },
              ],
            },
          ],
        },
        {
          $or: [
            { "user_info.private": false },
            { "following_info.0": { $exists: true } },
          ],
        },
      ],
    },
  },
]

module.exports = postValidationPipeline

/*
  NOTE:
  When some media is pending or rejected, the post status will be different than 'public'.
  Even with that, this code will only return Medias with the 'public' status.
*/
