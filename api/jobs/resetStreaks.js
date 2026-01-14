const cron = require("node-cron")
const User = require("../models/User")
const Post = require("../models/Post")

const {
  user: { defaultTimeZone },
} = require("../../constants/index")

async function resetBrokenStreaks() {
  try {
    const pipeline = [
      // only users who currently have a streak
      { $match: { currentStreak: { $gt: 0 } } },

      // resolve timezone
      { $addFields: { _tz: { $ifNull: ["$timeZone", defaultTimeZone] } } },

      // compute yesterdayKey in user's timezone (YYYY-MM-DD)
      {
        $addFields: {
          yesterdayKey: {
            $dateToString: {
              date: {
                $dateSubtract: {
                  startDate: "$$NOW",
                  unit: "day",
                  amount: 1,
                },
              },
              format: "%Y-%m-%d",
              timezone: "$_tz",
            },
          },
        },
      },

      // get latest post for each user
      {
        $lookup: {
          from: Post.collection.name, // usually "posts"
          let: { uid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$uid"] } } },
            { $sort: { created_at: -1 } },
            { $limit: 1 },
            { $project: { _id: 0, lastPostAt: "$created_at" } },
          ],
          as: "lastPost",
        },
      },

      // extract lastPostAt
      {
        $addFields: {
          lastPostAt: { $ifNull: [{ $first: "$lastPost.lastPostAt" }, null] },
        },
      },

      // convert lastPostAt -> lastPostKey in user's timezone (YYYY-MM-DD)
      {
        $addFields: {
          lastPostKey: {
            $cond: [
              { $eq: ["$lastPostAt", null] },
              null,
              {
                $dateToString: {
                  date: "$lastPostAt",
                  format: "%Y-%m-%d",
                  timezone: "$_tz",
                },
              },
            ],
          },
        },
      },

      // broken if lastPostKey is older than yesterdayKey OR user has no posts
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ["$lastPostKey", null] },
              { $lt: ["$lastPostKey", "$yesterdayKey"] },
            ],
          },
        },
      },

      { $project: { _id: 1 } },
    ]

    const usersToReset = await User.aggregate(pipeline)

    if (!usersToReset.length) {
      console.log("No broken streaks to reset.")
      return
    }

    const ids = usersToReset.map((u) => u._id)

    const res = await User.updateMany(
      { _id: { $in: ids } },
      { $set: { currentStreak: 0 } }
    )

    console.log(
      `Reset currentStreak=0 for ${ids.length} users (matched: ${res.matchedCount}, modified: ${res.modifiedCount}).`
    )
  } catch (err) {
    console.error("Error resetting broken streaks:", err)
  }
}

// every hourly at minute 5
cron.schedule("5 * * * *", async () => {
  console.log("Running broken streak reset job...")
  await resetBrokenStreaks()
})
