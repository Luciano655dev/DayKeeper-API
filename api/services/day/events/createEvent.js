const { parseISO, isValid } = require("date-fns")
const convertTimeZone = require("../../../utils/convertTimeZone")
const DayEvent = require("../../../models/DayEvent")

const {
  user: { defaultTimeZone },
  success: { created },
} = require("../../../../constants/index")

const createEvent = async (props) => {
  const {
    title,
    description = "",
    privacy,
    dateStart,
    dateEnd,
    placeId = null,
    loggedUser,
  } = props || {}

  if (!loggedUser?._id) {
    throw new Error("Unauthorized")
  }

  if (!title || typeof title !== "string" || title.trim().length < 1) {
    throw new Error("Title is required")
  }

  if (!dateStart || !dateEnd) {
    throw new Error("dateStart and dateEnd are required")
  }

  // Prefer ISO strings from client. If you use another format, change parsing here.
  const start = parseISO(dateStart)
  const end = parseISO(dateEnd)

  if (!isValid(start) || !isValid(end)) {
    throw new Error("Invalid dateStart or dateEnd format (expected ISO string)")
  }

  if (end < start) {
    throw new Error("dateEnd must be after dateStart")
  }

  const timeZone = loggedUser?.timeZone || defaultTimeZone

  // Store UTC dates in Mongo (Date objects are stored as UTC internally)
  const doc = {
    title: title.trim(),
    description,
    privacy,
    dateStart: start,
    dateEnd: end,
    placeId,
    user: loggedUser._id,
    created_at: new Date(),
  }

  const newEvent = await DayEvent.create(doc)

  const obj = newEvent.toObject()

  return created("Day Event", {
    data: {
      ...obj,
      dateStart: convertTimeZone(obj.dateStart, timeZone),
      dateEnd: convertTimeZone(obj.dateEnd, timeZone),
      created_at: convertTimeZone(
        obj.createdAt || obj.created_at || obj.createdAt,
        timeZone
      ),
    },
  })
}

module.exports = createEvent
