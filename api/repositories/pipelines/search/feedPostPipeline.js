const { Types } = require("mongoose")
const postValidationPipeline = require("../../common/postValidationPipeline")
const {
  user: { defaultTimeZone },
} = require("../../../../constants/index")

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

const FOLLOW_FIRST_BOOST = 1000000000 // 1e9

const feedPostPipeline = (
  mainUser,
  { scope = "a", dateStr = null, orderMode = "recent" } = {}
) => {
  const tz = mainUser?.timeZone || defaultTimeZone
  const mainUserId = toObjectIdOrNull(mainUser?._id)

  // ---- day filter stage (today or requested date) ----
  const dayMatchStage = dateStr
    ? {
        $match: {
          $expr: {
            $eq: [
              { $dateTrunc: { date: "$date", unit: "day", timezone: tz } },
              {
                $dateTrunc: {
                  date: {
                    $dateFromString: {
                      dateString: dateStr, // DD-MM-YYYY
                      format: "%d-%m-%Y",
                      timezone: tz,
                      onError: null,
                      onNull: null,
                    },
                  },
                  unit: "day",
                  timezone: tz,
                },
              },
            ],
          },
        },
      }
    : {
        $match: {
          $expr: {
            $eq: [
              { $dateTrunc: { date: "$date", unit: "day", timezone: tz } },
              { $dateTrunc: { date: "$$NOW", unit: "day", timezone: tz } },
            ],
          },
        },
      }

  const wantRelevanceSort =
    orderMode === "relevant" || orderMode === "follow_first"

  return [
    ...postValidationPipeline(mainUser),

    // today
    dayMatchStage,

    // scope
    ...(scope === "following"
      ? [
          {
            $match: {
              $or: [
                { "user_info._id": mainUserId },
                { "following_info.0": { $exists: true } },
              ],
            },
          },
        ]
      : []),

    // ---- likes info
    {
      $lookup: {
        from: "postLikes",
        let: { postId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
          {
            $group: {
              _id: null,
              totalLikes: { $sum: 1 },
              userLiked: {
                $sum: {
                  $cond: [{ $eq: ["$userId", mainUserId] }, 1, 0],
                },
              },
            },
          },
        ],
        as: "like_info",
      },
    },
    { $unwind: { path: "$like_info", preserveNullAndEmptyArrays: true } },

    // ---- comments info
    {
      $lookup: {
        from: "postComments",
        let: { postId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
          {
            $group: {
              _id: null,
              totalComments: { $sum: 1 },
              userCommented: {
                $push: {
                  $cond: [
                    { $eq: ["$userId", mainUserId] },
                    {
                      comment: "$comment",
                      gif: "$gif",
                      created_at: "$created_at",
                    },
                    false,
                  ],
                },
              },
            },
          },
        ],
        as: "comment_info",
      },
    },
    { $unwind: { path: "$comment_info", preserveNullAndEmptyArrays: true } },

    // ---- per-post computed fields
    {
      $addFields: {
        likes: { $ifNull: ["$like_info.totalLikes", 0] },
        userLiked: { $gt: ["$like_info.userLiked", 0] },

        comments: { $ifNull: ["$comment_info.totalComments", 0] },
        userCommented: { $ifNull: ["$comment_info.userCommented", false] },

        // per-post relevance (likes + comments)
        relevance: {
          $add: [
            { $ifNull: ["$like_info.totalLikes", 0] },
            { $ifNull: ["$comment_info.totalComments", 0] },
          ],
        },

        timeZoneMatch: 1,
      },
    },

    // order posts inside each user BEFORE grouping
    ...(wantRelevanceSort
      ? [{ $sort: { "user_info._id": 1, relevance: -1, date: 1, _id: -1 } }]
      : [{ $sort: { "user_info._id": 1, date: -1, _id: 1 } }]),

    // ---- group by user
    {
      $group: {
        _id: "$user_info._id",
        user_info: { $first: "$user_info" },

        // viewer follows this user OR it's the viewer
        isFollowing: {
          $max: {
            $cond: [
              {
                $or: [
                  { $eq: ["$user_info._id", mainUserId] },
                  { $gt: [{ $size: { $ifNull: ["$following_info", []] } }, 0] },
                ],
              },
              1,
              0,
            ],
          },
        },

        latestPostAt: { $max: "$date" },
        userRelevance: { $sum: "$relevance" },

        posts: {
          $push: {
            _id: "$_id",
            date: "$date",
            data: "$data",
            emotion: "$emotion",
            media: "$media",

            likes: "$likes",
            userLiked: "$userLiked",
            comments: "$comments",
            userCommented: "$userCommented",

            relevance: "$relevance",
          },
        },
      },
    },

    // ---- getDataWithPages sorting
    {
      $addFields: {
        created_at: "$latestPostAt",

        relevance:
          orderMode === "follow_first"
            ? {
                $add: [
                  "$userRelevance",
                  {
                    $cond: [
                      { $eq: ["$isFollowing", 1] },
                      FOLLOW_FIRST_BOOST,
                      0,
                    ],
                  },
                ],
              }
            : "$userRelevance",

        timeZoneMatch: 1,
      },
    },

    // ---- final shape
    {
      $project: {
        _id: 1,
        user_info: "$user_info",

        isFollowing: 1,
        userRelevance: 1,

        posts: {
          $map: {
            input: "$posts",
            as: "p",
            in: {
              id: "$$p._id",
              time: {
                $dateToString: {
                  format: "%H:%M",
                  date: "$$p.date",
                  timezone: tz,
                },
              },
              date: {
                $dateToString: {
                  format: "%Y-%m-%d %H:%M:%S",
                  date: "$$p.date",
                  timezone: tz,
                },
              },
              content: "$$p.data",
              emotion: "$$p.emotion",
              media: "$$p.media",

              likes: "$$p.likes",
              userLiked: "$$p.userLiked",
              comments: "$$p.comments",
              userCommented: "$$p.userCommented",

              relevance: "$$p.relevance",
            },
          },
        },

        // getDataWithPages sort
        created_at: 1,
        relevance: 1,
        timeZoneMatch: 1,
      },
    },
  ]
}

module.exports = feedPostPipeline
