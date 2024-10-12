const { formatInTimeZone } = require("date-fns-tz")
const { listTimeZones } = require(`timezone-support`)

const {
  user: { defaultTimeZone },
} = require(`../../constants/index`)

const convertTimeZone = (originalDate, timeZone = defaultTimeZone) => {
  try {
    if (!listTimeZones().includes(timeZone))
      formatInTimeZone(originalDate, timeZone, "yyyy-MM-dd HH:mm:ssXXX")

    return formatInTimeZone(originalDate, timeZone, "yyyy-MM-dd HH:mm:ssXXX")
  } catch (error) {
    return originalDate
  }
}

module.exports = convertTimeZone
