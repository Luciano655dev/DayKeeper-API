// TODO search by title, by date, upcoming, past and ongoing events
const { searchEventPipeline } = require("../../../repositories/index")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const getDataWithPages = require("../../getDataWithPages")
const mongoose = require("mongoose")
const { format } = require("date-fns")

const {
  user: { defaultTimeZone },
  errors: { invalidValue },
  success: { fetched },
} = require("../../../../constants/index")

const searchEvent = async (props) => {
  const { userId, page, maxPageSize } = props
  const searchQuery = props.q || ""
  const filter = props?.filter || "upcoming"
  const loggedUser = props.user

  console.log(searchEventPipeline)

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) return invalidValue("User ID")
    userIdObjId = new mongoose.Types.ObjectId(userId)

    const response = await getDataWithPages(
      {
        type: "DayEvent",
        pipeline: searchEventPipeline(searchQuery, userIdObjId, filter),
        order: "recent",
        page,
        maxPageSize,
      },
      loggedUser
    )

    // Convert to TZ
    const timeZone = loggedUser?.timeZone || defaultTimeZone
    response.data = response.data.map((event) => ({
      ...event,
      date: format(convertTimeZone(event.timeStart, timeZone), "dd-MM-yyyy"),
      timeStart: convertTimeZone(event.timeStart, timeZone),
      timeEnd: convertTimeZone(event.timeEnd, timeZone),
    }))

    return fetched(`Events`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = searchEvent
