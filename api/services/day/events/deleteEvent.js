const DayEvent = require("../../../models/DayEvent")
const getEventById = require("./getEventById")

const {
  errors: { notFound, custom: customErr },
  success: { deleted },
} = require("../../../../constants/index")

const deleteEvent = async (props) => {
  const { eventId, loggedUser } = props

  try {
    const event = await getEventById({ eventId })
    if (!event) return notFound("Event")

    if (event.event.user != loggedUser._id)
      return unauthorized(
        "You can't edit this event",
        "only the person who creted this event can delete it",
        409
      )

    await DayEvent.findOneAndDelete({ _id: eventId })

    return deleted(`Day Event`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteEvent
// TODO lembrar de ver sobre eventos privados e publicos e lidar com contas privadas e publicas
// TODO tambem lidr com contas bloqueadas, banidas, etc...
