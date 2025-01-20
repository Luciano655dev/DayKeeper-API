const DayEvent = require("../../../models/DayEvent")
const getEventPipeline = require("../../../repositories/pipelines/day/events/getEventPipeline")
const mongoose = require("mongoose")

const {
  errors: { notFound, invalidValue },
  success: { fetched },
} = require("../../../../constants/index")

const getEvent = async ({ eventId, loggedUser }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId))
      return invalidValue("Event ID")

    const event = await DayEvent.aggregate(
      getEventPipeline(eventId, loggedUser)
    )

    if (!event || event?.length == 0) return notFound("Event")

    return fetched("event", { data: event[0] })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = getEvent
