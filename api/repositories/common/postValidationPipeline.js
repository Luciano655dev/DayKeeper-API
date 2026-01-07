const { Types } = require("mongoose")

function toObjectIdOrNull(value) {
  try {
    if (!value) return null
    if (value instanceof Types.ObjectId) return value
    if (Types.ObjectId.isValid(value)) return new Types.ObjectId(value)
    return null
  } catch {
    return null
  }
}

const postValidationPipeline = (mainUser) => {
  const mainUserId = toObjectIdOrNull(mainUser?._id)

  return [
    // Join post owner (user_info)
    {
      $lookup: {
        from: "users",
        let: {
          userId: {
            $convert: {
              input: "$user",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
          // optional: keep only needed fields
          {
            $project: {
              password: 0,
              device_tokens: 0,
            },
          },
        ],
        as: "user_info",
      },
    },
    { $unwind: "$user_info" },

    // Join media (public media only)
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
                        $filter: {
                          input: {
                            $map: {
                              input: { $ifNull: ["$$mediaIds", []] },
                              as: "id",
                              in: {
                                $convert: {
                                  input: "$$id",
                                  to: "objectId",
                                  onError: null,
                                  onNull: null,
                                },
                              },
                            },
                          },
                          as: "oid",
                          cond: { $ne: ["$$oid", null] },
                        },
                      },
                    ],
                  },
                  // Only public media
                  { $eq: ["$status", "public"] },
                ],
              },
            },
          },
        ],
        as: "media",
      },
    },

    // Following relationship
    {
      $lookup: {
        from: "followers",
        let: { postUserId: "$user_info._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followerId", mainUserId] },
                  { $eq: ["$followingId", "$$postUserId"] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "following_info",
      },
    },

    // Block relationship
    {
      $lookup: {
        from: "blocks",
        let: { postUserId: "$user_info._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$blockId", mainUserId] },
                  { $eq: ["$blockedId", "$$postUserId"] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "block_info",
      },
    },

    // Close friends relationship
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
                  { $eq: ["$closeFriendId", mainUserId] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "isInCloseFriends",
      },
    },

    {
      $match: {
        $and: [
          // Not blocked by me
          { "block_info.0": { $exists: false } },

          // Post owner not banned
          { "user_info.banned": { $ne: true } },

          // Post must be public
          { status: "public" },

          // Post privacy rules
          {
            $or: [
              // public OR missing privacy = public
              { privacy: "public" },
              { privacy: { $exists: false } },

              // private: only owner can see
              {
                $and: [{ privacy: "private" }, { "user_info._id": mainUserId }],
              },

              // close friends: only if viewer is in close friends list
              {
                $and: [
                  { privacy: "close friends" },
                  { "isInCloseFriends.0": { $exists: true } },
                ],
              },
            ],
          },

          // If the user is private, require following (treat missing as not-private)
          {
            $or: [
              { "user_info.private": { $ne: true } },
              { "following_info.0": { $exists: true } },

              // owner can always see their own even if private
              { "user_info._id": mainUserId },
            ],
          },
        ],
      },
    },
  ]
}

module.exports = postValidationPipeline
