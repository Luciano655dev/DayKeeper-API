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
    date, // dd-mm-yyyy
    timeStart, // HH:mm:ss
    timeEnd, // HH:mm:ss
    placeId, // location
  } = req.body

  // Validations
  if (description?.length > maxEventDescriptionLength)
    return res.status(413).json({ message: "Event Description is too long" })
  if (title?.length > maxEventTitleLength)
    return res.status(413).json({ message: "Event Title is too long" })
  if (!/^\d{2}-\d{2}-\d{4}$/.test(date))
    return res.status(400).json({ message: "The Date is Invalid" })
  if (
    !/^\d{2}:\d{2}:\d{2}$/.test(timeStart) ||
    !/^\d{2}:\d{2}:\d{2}$/.test(timeEnd)
  )
    return res.status(413).json({ message: "The Start/End Date is Invalid" })

  try {
    if (placeId) {
      const placeById = await getPlaceById({ placeId })
      if (!placeById || placeById?.status != 200)
        return res.status(placeById.code).json({ message: placeById.message })
    }

    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = createEvent
