const { parse, addDays, isValid } = require("date-fns")
const { fromZonedTime, formatInTimeZone } = require("date-fns-tz")

function getDayRangeDDMMYYYY(dateStr, tz) {
  const localStart = parse(dateStr, "dd-MM-yyyy", new Date())
  if (!isValid(localStart)) return null

  const localEnd = addDays(localStart, 1)

  return {
    start: fromZonedTime(localStart, tz),
    end: fromZonedTime(localEnd, tz),
  }
}

function getTodayRange(tz) {
  const todayStr = formatInTimeZone(new Date(), tz, "dd-MM-yyyy")
  return getDayRangeDDMMYYYY(todayStr, tz)
}

module.exports = { getDayRangeDDMMYYYY, getTodayRange }
