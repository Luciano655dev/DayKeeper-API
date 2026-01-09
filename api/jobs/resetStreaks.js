const cron = require("node-cron")
const User = require("../models/User")

const {
  user: { defaultTimeZone },
} = require("../../constants/index")

// Resets streaks for users whose streak is broken in *their own timezone*.
// Condition: currentStreak > 0 AND streakLastDay < yesterdayKey (in user TZ)
async function resetBrokenStreaks() {
  try {
    const pipeline = [
      {
        $match: {
          currentStreak: { $gt: 0 },
          streakLastDay: { $type: "string" }, // must exist + be string "yyyy-MM-dd"
        },
      },
      {
        $addFields: {
          _tz: { $ifNull: ["$timeZone", defaultTimeZone] },
        },
      },
      {
        $addFields: {
          todayKey: {
            $dateToString: {
              date: "$$NOW",
              format: "%Y-%m-%d",
              timezone: "$_tz",
            },
          },
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
      // streak is broken if lastDay is older than yesterday in their TZ
      {
        $match: {
          $expr: { $lt: ["$streakLastDay", "$yesterdayKey"] },
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

// Run hourly (minute 5). Hourly avoids timezone edge cases.
cron.schedule("5 * * * *", () => {
  console.log("Running broken streak reset job...")
  resetBrokenStreaks()
})
