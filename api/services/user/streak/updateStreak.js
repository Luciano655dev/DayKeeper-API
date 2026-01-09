const User = require("../../../models/User")
const { formatInTimeZone } = require("date-fns-tz")
const { parseISO, differenceInCalendarDays } = require("date-fns")

const {
  user: { defaultTimeZone },
} = require("../../../../constants/index")

function dayKeyNow(timeZone) {
  return formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd")
}

const updateStreak = async (loggedUser) => {
  const timeZone = loggedUser?.timeZone || defaultTimeZone
  const todayKey = dayKeyNow(timeZone)

  const lastKey = loggedUser.streakLastDay || null
  const current = Number(loggedUser.currentStreak || 0)
  const max = Number(loggedUser.maxStreak || 0)

  // first post ever (streak-wise)
  if (!lastKey) {
    const nextCurrent = 1
    const nextMax = Math.max(max, nextCurrent)

    await User.updateOne(
      { _id: loggedUser._id },
      {
        $set: {
          currentStreak: nextCurrent,
          maxStreak: nextMax,
          streakLastDay: todayKey,
        },
      }
    )
    return { currentStreak: nextCurrent, maxStreak: nextMax }
  }

  // already posted today (don’t change streak)
  if (lastKey === todayKey) {
    return { currentStreak: current, maxStreak: max }
  }

  // compare day difference in calendar-days
  const daysDiff = differenceInCalendarDays(
    parseISO(todayKey),
    parseISO(lastKey)
  )

  let nextCurrent
  if (daysDiff === 1) nextCurrent = current + 1 // continued
  else nextCurrent = 1 // missed 1+ full days => reset to 1 on new post

  const nextMax = Math.max(max, nextCurrent)

  await User.updateOne(
    { _id: loggedUser._id },
    {
      $set: {
        currentStreak: nextCurrent,
        maxStreak: nextMax,
        streakLastDay: todayKey,
      },
    }
  )

  return { currentStreak: nextCurrent, maxStreak: nextMax }
}

module.exports = updateStreak
