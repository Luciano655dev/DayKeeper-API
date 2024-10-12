const { parse } = require("date-fns")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const DayEvent = require("../../../models/DayEvent")

const {
  user: { defaultTimeZone },
  success: { created },
} = require("../../../../constants/index")

const createEvent = async (props) => {
  const {
    title,
    description,
    date, // dd-mm-yyyy
    timeStart, // HH:mm:ss
    timeEnd, // HH:mm:ss
    placeId, // location
    loggedUser,
  } = props

  try {
    const timeZone = loggedUser?.timeZone || defaultTimeZone

    const startDateTime = parse(
      `${date} ${timeStart}`,
      "dd-MM-yyyy HH:mm:ss",
      new Date()
    )
    const endDateTime = parse(
      `${date} ${timeEnd}`,
      "dd-MM-yyyy HH:mm:ss",
      new Date()
    )

    // Convert to TZ
    const zonedStartDateTime = convertTimeZone(startDateTime, timeZone)
    const zonedEndDateTime = convertTimeZone(endDateTime, timeZone)

    const newEvent = new DayEvent({
      title,
      description,
      date,
      timeStart: startDateTime,
      timeEnd: endDateTime,
      placeId,
      user: loggedUser._id,
    })

    await newEvent.save()

    return created(`Day Event`, {
      event: {
        ...newEvent._doc,
        timeStart: zonedStartDateTime,
        timeEnd: zonedEndDateTime,
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = createEvent