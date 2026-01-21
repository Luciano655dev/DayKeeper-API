const { Types } = require("mongoose")
const postInfoPipeline = require("../../common/postInfoPipeline")
const {
  user: { defaultTimeZone },
  maxPostsPerUser: DEFAULT_MAXPOSTSPERUSER,
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
function time12hExpr(dateExpr, tz) {
  return {
    $let: {
      vars: {
        h24: { $hour: { date: dateExpr, timezone: tz } },
        m: { $dateToString: { format: "%M", date: dateExpr, timezone: tz } },
      },
      in: {
        $concat: [
          {
            $toString: {
              $cond: [
                { $eq: ["$$h24", 0] },
                12,
                {
                  $cond: [
                    { $gt: ["$$h24", 12] },
                    { $subtract: ["$$h24", 12] },
                    "$$h24",
                  ],
                },
              ],
            },
          },
          ":",
          "$$m",
          " ",
          { $cond: [{ $lt: ["$$h24", 12] }, "AM", "PM"] },
        ],
      },
    },
  }
}

const FOLLOW_FIRST_BOOST = 1e9

const feedPostPipeline = (
  mainUser,
  {
    scope = "a",
    dateStr = null,
    orderMode = "recent",
    maxPostsPerUser = DEFAULT_MAXPOSTSPERUSER,
  } = {},
) => {
  const tz = mainUser?.timeZone || defaultTimeZone
  const mainUserId = toObjectIdOrNull(mainUser?._id)

  const wantRelevanceSort =
    orderMode === "relevant" || orderMode === "follow_first"

  const dayStartExpr = dateStr
    ? {
        $dateTrunc: {
          date: {
            $dateFromString: {
              dateString: dateStr,
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

  const visibilityExpr = {
    $or: [
      { $eq: ["$user", "$$viewerId"] },
      {
        $or: [
          { $eq: ["$privacy", "public"] },
          { $eq: [{ $type: "$privacy" }, "missing"] },
        ],
      },
      {
        $and: [
          { $eq: ["$privacy", "close friends"] },
          { $eq: ["$$isCloseFriend", 1] },
        ],
      },
    ],
  }

  return [
    ...postInfoPipeline(mainUser),

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

    // order posts inside each user BEFORE grouping
    ...(wantRelevanceSort
      ? [{ $sort: { "user_info._id": 1, relevance: -1, date: 1, _id: -1 } }]
      : [{ $sort: { "user_info._id": 1, date: -1, _id: 1 } }]),

    // group by user
    {
      $group: {
        _id: "$user_info._id",
        user_info: { $first: "$user_info" },

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
            edited_at: "$edited_at",
            data: "$data",
            privacy: "$privacy",
            media: "$media",
            isOwner: "$isOwner",

            likes: "$likes",
            userLiked: "$userLiked",
            comments: "$comments",
            userCommented: "$userCommented",

            relevance: "$relevance",
          },
        },
      },
    },

    { $addFields: { dayStart: dayStartExpr } },
    {
      $addFields: {
        dayEnd: {
          $dateAdd: { startDate: "$dayStart", unit: "day", amount: 1 },
        },
      },
    },

    // notes count
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

    // tasks count
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

    // events count
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

    // paging sort + extra stats
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

        postsCount: { $size: "$posts" },
        lastPostTime: time12hExpr("$latestPostAt", tz),
      },
    },
    // keep only the 3 posts
    {
      $addFields: {
        posts: { $slice: ["$posts", maxPostsPerUser] },
      },
    },

    {
      $unset: ["note_count", "task_count", "event_count", "dayStart", "dayEnd"],
    },

    // final shape
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
              time: time12hExpr("$$p.date", tz),
              date: {
                $dateToString: {
                  format: "%Y-%m-%d %H:%M:%S",
                  date: "$$p.date",
                  timezone: tz,
                },
              },
              content: "$$p.data",
              privacy: "$$p.privacy",
              media: "$$p.media",
              isOwner: "$$p.isOwner",

              likes: "$$p.likes",
              userLiked: "$$p.userLiked",
              comments: "$$p.comments",
              userCommented: "$$p.userCommented",

              edited_at: {
                $dateToString: {
                  format: "%Y-%m-%d %H:%M:%S",
                  date: "$$p.edited_at",
                  timezone: tz,
                },
              },

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
