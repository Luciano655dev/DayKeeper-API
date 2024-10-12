const DayEvent = require("../../../models/DayEvent")
const mongoose = require("mongoose")

const {
  errors: { invalidValue },
  success: { updated },
} = require("../../../../constants/index")

const editEvent = async (props) => {
  const {
    eventId,

    title,
    description,
    date, // dd-mm-yyyy
    timeStart, // HH:mm:ss
    timeEnd, // HH:mm:ss
    placeId, // location
    loggedUser,
  } = props

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId))
      return invalidValue("Event ID")

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(date && { date }),
      ...(timeStart && { timeStart }),
      ...(timeEnd && { timeEnd }),
      ...(placeId && { placeId }),
      user: loggedUser._id,
    }

    await DayEvent.findByIdAndUpdate(
      eventId,
      {
        $set: updateData,
      },
      { new: true }
    )

    return updated(`Day Event`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = editEvent
