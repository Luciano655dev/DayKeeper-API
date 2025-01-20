const { parse } = require("date-fns")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const DayEvent = require("../../../models/DayEvent")

const {
  user: { defaultTimeZone },
  success: { created },
} = require("../../../../constants/index")

const createEvent = async (props) => {
  const {
    title,
    description,
    privacy,
    dateStart,
    dateEnd, // HH:mm:ss
    placeId, // location
    loggedUser,
  } = props

  try {
    const timeZone = loggedUser?.timeZone || defaultTimeZone

    const newEvent = new DayEvent({
      title,
      description,
      dateStart,
      dateEnd,
      placeId,
      privacy,
      user: loggedUser._id,
    })

    await newEvent.save()

    return created(`Day Event`, {
      data: {
        ...newEvent._doc,
        dateStart: convertTimeZone(dateStart, timeZone),
        dateEnd: convertTimeZone(dateEnd, timeZone),
        created_at: convertTimeZone(new Date(), timeZone),
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = createEvent
