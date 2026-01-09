const mongoose = require("mongoose")
const DayEvent = require("../../../models/DayEvent")

const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../../constants/index")

const deleteEvent = async (props) => {
  const { eventId, loggedUser } = props || {}

  if (!loggedUser?._id) {
    return unauthorized("Unauthorized", "Login required", 401)
  }

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return notFound("Event")
  }

  try {
    const deletedDoc = await DayEvent.findOneAndDelete({
      _id: eventId,
      user: loggedUser._id,
    }).select("_id")

    if (!deletedDoc) {
      return notFound("Event")
    }

    return deleted("Day Event")
  } catch (error) {
    throw error
  }
}

module.exports = deleteEvent
