const mongoose = require("mongoose")
const DayEvent = require("../../../models/DayEvent")
const getEventPipeline = require("../../../repositories/pipelines/day/events/getEventPipeline")

const {
  errors: { notFound, invalidValue, unauthorized },
  success: { fetched },
} = require("../../../../constants/index")

const getEvent = async ({ eventId, loggedUser }) => {
  if (!loggedUser?._id)
    return unauthorized("Unauthorized", "Login required", 401)

  if (!mongoose.Types.ObjectId.isValid(eventId)) return invalidValue("Event ID")

  try {
    const event = await DayEvent.aggregate(
      getEventPipeline(eventId, loggedUser)
    )

    if (!event || event.length === 0) return notFound("Event")

    return fetched("event", { data: event[0] })
  } catch (error) {
    throw error
  }
}

module.exports = getEvent
