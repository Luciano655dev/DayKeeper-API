const { parse, isValid, isBefore } = require("date-fns")
const getPlaceById = require("../../../../api/services/location/getPlaceById")

const {
  day: {
    event: { maxEventTitleLength, maxEventDescriptionLength },
  },
} = require("../../../../constants/index")

const createEvent = async (req, res, next) => {
  const {
    title,
    description,
    privacy,
    placeId, // location
  } = req.body

  // Validations
  if (description?.length > maxEventDescriptionLength)
    return res.status(413).json({ message: "Event Description is too long" })
  if (title?.length > maxEventTitleLength)
    return res.status(413).json({ message: "Event Title is too long" })

  const dateStart = new Date(req.body.dateStart)
  const dateEnd = new Date(req.body.dateEnd)
  if (
    !isValid(new Date(dateStart)) ||
    !isValid(new Date(dateEnd)) ||
    !isBefore(dateStart, dateEnd)
  )
    return res.status(400).json({ message: "Invalid Date" })

  // Privacy
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
    if (placeId) {
      const placeById = await getPlaceById({ placeId })
      if (!placeById || placeById?.status != 200)
        return res.status(placeById.code).json({ message: placeById.message })
    }

    return next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = createEvent
