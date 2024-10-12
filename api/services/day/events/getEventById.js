const convertTimeZone = require(`../../../utils/convertTimeZone`)
const DayEvent = require("../../../models/DayEvent")
const mongoose = require("mongoose")
const { format } = require("date-fns")

const {
  user: { defaultTimeZone },
  errors: { invalidValue, fieldNotFilledIn, notFound },
  success: { fetched },
} = require("../../../../constants/index")

const getEventById = async (props) => {
  const { eventId, loggedUser } = props
  const timeZone = loggedUser?.timeZone || defaultTimeZone

  if (!eventId) return fieldNotFilledIn("Event ID")

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId))
      return invalidValue("Event ID")

    const event = await DayEvent.findOne({ _id: eventId })
    if (!event) return notFound("Event")

    return fetched(`Day Event`, {
      event: {
        ...event._doc,
        date: format(convertTimeZone(event.timeStart, timeZone), "dd-MM-yyyy"),
        timeStart: convertTimeZone(event.timeStart, timeZone),
        timeEnd: convertTimeZone(event.timeEnd, timeZone),
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getEventById
