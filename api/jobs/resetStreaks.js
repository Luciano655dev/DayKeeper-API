const cron = require("node-cron")
const User = require("../models/User") // Import User model
const { startOfDay, subDays } = require("date-fns")

const resetStrikes = async () => {
  try {
    const today = startOfDay(new Date())
    const yesterday = subDays(today, 1)

    const pipeline = [
      {
        $match: { currentStrike: { $gt: 0 } },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "posts",
        },
      },
      {
        $addFields: {
          postsYesterday: {
            $filter: {
              input: "$posts",
              as: "post",
              cond: {
                $and: [
                  { $gte: ["$$post.created_at", yesterday] },
                  { $lt: ["$$post.created_at", today] },
                ],
              },
            },
          },
          postsToday: {
            $filter: {
              input: "$posts",
              as: "post",
              cond: {
                $gte: ["$$post.created_at", today],
              },
            },
          },
        },
      },
      {
        $addFields: {
          hasPostedYesterday: { $gt: [{ $size: "$postsYesterday" }, 0] },
          hasPostedToday: { $gt: [{ $size: "$postsToday" }, 0] },
        },
      },
      {
        $match: {
          hasPostedYesterday: false,
          hasPostedToday: false,
        },
      },
      {
        $project: {
          _id: 1,
          hasPostedYesterday: 1,
          hasPostedToday: 1,
        },
      },
    ]

    const usersToReset = await User.aggregate(pipeline)

    if (usersToReset.length > 0) {
      const userIds = usersToReset.map((user) => user._id)

      await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { currentStrike: 0 } }
      )

      console.log(`Strike reset for ${usersToReset.length} users.`)
    } else {
      console.log("All strikes are up to date. No resets needed.")
    }
  } catch (error) {
    console.error("Error resetting strikes:", error.message)
  }
}

cron.schedule("59 23 * * *", () => {
  console.log("Running strike reset job...")
  resetStrikes()
})
