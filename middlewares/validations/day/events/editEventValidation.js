const { parse, isValid } = require("date-fns")
const getPlaceById = require("../../../../api/services/location/getPlaceById")
const getEventById = require("../../../../api/services/day/events/getEventById")

const {
  day: {
    event: { maxEventTitleLength, maxEventDescriptionLength },
  },
} = require("../../../../constants/index")

const createEvent = async (req, res, next) => {
  const {
    eventId,

    title,
    description,
    date, // dd-mm-yyyy
    timeStart, // HH:mm:ss
    timeEnd, // HH:mm:ss
    privacy,
    placeId, // location
  } = req.body

  // Validations
  if (description && description?.length > maxEventDescriptionLength)
    return res.status(413).json({ message: "Event Description is too long" })
  if (title && title?.length > maxEventTitleLength)
    return res.status(413).json({ message: "Event Title is too long" })

  const parsedDate = parse(date, "dd-MM-yyyy", new Date())
  if (date && (!/^\d{2}-\d{2}-\d{4}$/.test(date) || !isValid(parsedDate)))
    return res.status(400).json({ message: "The Date is Invalid" })

  const parsedTimeStart = parse(
    `${date} ${timeStart}`,
    "dd-MM-yyyy HH:mm:ss",
    new Date()
  )
  const parsedTimeEnd = parse(
    `${date} ${timeEnd}`,
    "dd-MM-yyyy HH:mm:ss",
    new Date()
  )
  if (
    (timeStart &&
      (!/^\d{2}:\d{2}:\d{2}$/.test(timeStart) || !isValid(parsedTimeStart))) ||
    (timeEnd &&
      (!/^\d{2}:\d{2}:\d{2}$/.test(timeEnd) || !isValid(parsedTimeEnd)))
  )
    return res.status(413).json({ message: "The Start/End Date is Invalid" })

  // Privacy
  if (privacy)
    switch (privacy) {
      case "public":
      case "private":
      case "close friends":
      case undefined:
        break
      default:
        return res.status(404).json({ message: "Invalid privacy value" })
    }

  try {
    const event = await getEventById({ eventId })
    if (!event) return res.status(404).json({ message: "Event not Found" })

    if (placeId) {
      const placeById = await getPlaceById({ placeId })
      if (!placeById || placeById?.code != 200)
        return res.status(placeById.code).json({ message: placeById.message })
    }

    return next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = createEvent
