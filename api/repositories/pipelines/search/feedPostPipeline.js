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

const FOLLOW_FIRST_BOOST = 1e9

const feedPostPipeline = (
  mainUser,
  { scope = "a", dateStr = null, orderMode = "recent" } = {}
) => {
  const tz = mainUser?.timeZone || defaultTimeZone
  const mainUserId = toObjectIdOrNull(mainUser?._id)

  const wantRelevanceSort =
    orderMode === "relevant" || orderMode === "follow_first"

  // One shared "day start" expression we can reuse
  const dayStartExpr = dateStr
    ? {
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
      }
    : { $dateTrunc: { date: "$$NOW", unit: "day", timezone: tz } }

  // Match posts that are on that day (in the viewer timezone)
  const dayMatchStage = {
    $match: {
      $expr: {
        $eq: [
          { $dateTrunc: { date: "$date", unit: "day", timezone: tz } },
          dayStartExpr,
        ],
      },
    },
  }

  // Shared "can viewer see this item" match for notes/tasks/events
  const visibilityExpr = {
    $or: [
      // owner sees all
      { $eq: ["$user", "$$viewerId"] },

      // public OR missing privacy
      {
        $or: [
          { $eq: ["$privacy", "public"] },
          { $eq: [{ $type: "$privacy" }, "missing"] },
        ],
      },

      // close friends
      {
        $and: [
          { $eq: ["$privacy", "close friends"] },
          { $eq: ["$$isCloseFriend", 1] },
        ],
      },
    ],
  }

  return [
    // adds: user_info, following_info, block_info, isInCloseFriends, etc (and filters out blocked/banned/private rules)
    ...postValidationPipeline(mainUser),

    // only the requested day (or today)
    dayMatchStage,

    // scope filter (following)
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

    // ---- group by user (this is your “user day card”)
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

        // viewer is in close friends (for this user's content)
        isCloseFriend: {
          $max: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$isInCloseFriends", []] } }, 0] },
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

    // ---- add day boundaries (same day as the feed)
    { $addFields: { dayStart: dayStartExpr } },
    {
      $addFields: {
        dayEnd: {
          $dateAdd: { startDate: "$dayStart", unit: "day", amount: 1 },
        },
      },
    },

    // ---- notes count
    {
      $lookup: {
        from: "dayNote",
        let: {
          uid: "$_id",
          dayStart: "$dayStart",
          dayEnd: "$dayEnd",
          viewerId: mainUserId,
          isCloseFriend: "$isCloseFriend",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$uid"] },
                  { $gte: ["$date", "$$dayStart"] },
                  { $lt: ["$date", "$$dayEnd"] },
                ],
              },
            },
          },
          { $match: { $expr: visibilityExpr } },
          { $count: "count" },
        ],
        as: "note_count",
      },
    },
    {
      $addFields: {
        notesCount: {
          $ifNull: [{ $arrayElemAt: ["$note_count.count", 0] }, 0],
        },
      },
    },

    // ---- tasks count
    {
      $lookup: {
        from: "dayTask",
        let: {
          uid: "$_id",
          dayStart: "$dayStart",
          dayEnd: "$dayEnd",
          viewerId: mainUserId,
          isCloseFriend: "$isCloseFriend",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$uid"] },
                  { $gte: ["$date", "$$dayStart"] },
                  { $lt: ["$date", "$$dayEnd"] },
                ],
              },
            },
          },
          { $match: { $expr: visibilityExpr } },
          { $count: "count" },
        ],
        as: "task_count",
      },
    },
    {
      $addFields: {
        tasksCount: {
          $ifNull: [{ $arrayElemAt: ["$task_count.count", 0] }, 0],
        },
      },
    },

    // ---- events count (events whose dateStart falls within the day)
    {
      $lookup: {
        from: "dayEvent",
        let: {
          uid: "$_id",
          dayStart: "$dayStart",
          dayEnd: "$dayEnd",
          viewerId: mainUserId,
          isCloseFriend: "$isCloseFriend",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$uid"] },
                  { $gte: ["$dateStart", "$$dayStart"] },
                  { $lt: ["$dateStart", "$$dayEnd"] },
                ],
              },
            },
          },
          { $match: { $expr: visibilityExpr } },
          { $count: "count" },
        ],
        as: "event_count",
      },
    },
    {
      $addFields: {
        eventsCount: {
          $ifNull: [{ $arrayElemAt: ["$event_count.count", 0] }, 0],
        },
      },
    },

    // ---- getDataWithPages sorting + extra stats
    {
      $addFields: {
        // paging sort fields
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

        // extra stats you asked for
        postsCount: { $size: "$posts" },
        lastPostTime: {
          $dateToString: {
            format: "%H:%M",
            date: "$latestPostAt",
            timezone: tz,
          },
        },
      },
    },

    // remove temp fields (no mixing project styles)
    {
      $unset: ["note_count", "task_count", "event_count", "dayStart", "dayEnd"],
    },

    // ---- final shape (INCLUSION ONLY)
    {
      $project: {
        _id: 1,
        user_info: 1,

        isFollowing: 1,
        isCloseFriend: 1,

        postsCount: 1,
        lastPostTime: 1,
        notesCount: 1,
        tasksCount: 1,
        eventsCount: 1,

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

        created_at: 1,
        relevance: 1,
        timeZoneMatch: 1,
      },
    },
  ]
}

module.exports = feedPostPipeline
