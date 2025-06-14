const DayEvent = require("../../../models/DayEvent")
const getEvent = require("./getEvent")

const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../../constants/index")

const deleteEvent = async (props) => {
  const { eventId, loggedUser } = props

  try {
    const event = await getEvent({ eventId, loggedUser })
    if (!event || event?.code != 200) return notFound("Event")

    if (!event.data.user.equals(loggedUser._id))
      return unauthorized(
        "You can't delete this event",
        "only the person who created this event can delete it",
        409
      )

    await DayEvent.findOneAndDelete({ _id: eventId })

    return deleted(`Day Event`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteEvent
