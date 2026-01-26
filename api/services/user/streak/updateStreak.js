const { formatInTimeZone } = require("date-fns-tz")
const { subDays } = require("date-fns")
const User = require("../../../models/User")
const {
  user: { defaultTimeZone },
} = require("../../../../constants/index")

function dayKey(d, tz) {
  return formatInTimeZone(d, tz, "dd-MM-yyyy")
}

async function updateStreak(userId, timeZone) {
  // always prefer the user's real tz from DB if not provided
  const baseUser = await User.findById(userId).select(
    "timeZone currentStreak maxStreak streakLastDay",
  )
  console.log(baseUser.streakLastDay)
  if (!baseUser) return null

  const tz = timeZone || baseUser.timeZone || defaultTimeZone

  const todayKey = dayKey(new Date(), tz)
  const yesterdayKey = dayKey(subDays(new Date(), 1), tz)

  const lastKey = baseUser.streakLastDay || null
  const current = Number(baseUser.currentStreak || 0)
  const max = Number(baseUser.maxStreak || 0)

  // first post ever (streak-wise)
  if (!lastKey) {
    const nextCurrent = 1
    const nextMax = Math.max(max, nextCurrent)

    return await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          currentStreak: nextCurrent,
          maxStreak: nextMax,
          streakLastDay: todayKey,
        },
      },
      { new: true },
    ).select("currentStreak maxStreak streakLastDay")
  }

  // already posted today (do nothing)
  if (lastKey === todayKey) {
    return baseUser
  }

  // continue only if last post was yesterday in the SAME timezone
  const nextCurrent = lastKey === yesterdayKey ? current + 1 : 1
  const nextMax = Math.max(max, nextCurrent)

  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        currentStreak: nextCurrent,
        maxStreak: nextMax,
        streakLastDay: todayKey,
      },
    },
    { new: true },
  ).select("currentStreak maxStreak streakLastDay")
}

module.exports = updateStreak
