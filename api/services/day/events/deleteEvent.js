const mongoose = require("mongoose")

const deleteEventDoc = require("./delete/deleteEvents")

const {
  errors: { notFound },
  success: { deleted },
} = require("../../../../constants/index")

const deleteEvent = async (props) => {
  const { eventId } = props || {}

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    return notFound("Event")
  }

  const changed = await deleteEventDoc(eventId)

  if (!changed) return notFound("Event")

  return deleted("Day Event")
}

module.exports = deleteEvent
