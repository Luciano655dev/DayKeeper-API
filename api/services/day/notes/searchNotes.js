const { searchNotePipeline } = require("../../../repositories/index")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const getDataWithPages = require("../../getDataWithPages")
const mongoose = require("mongoose")
const { format } = require("date-fns")

const {
  user: { defaultTimeZone },
  errors: { invalidValue },
  success: { fetched },
} = require("../../../../constants/index")

const SearchNotes = async (props) => {
  const { userId, page, maxPageSize } = props
  const searchQuery = props.q || ""
  const filter = props?.filter || "upcoming" // `upcoming` or `past`
  const loggedUser = props.user

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) return invalidValue("User ID")
    userIdObjId = new mongoose.Types.ObjectId(userId)

    const response = await getDataWithPages(
      {
        type: "DayNote",
        pipeline: searchNotePipeline(searchQuery, userIdObjId, filter),
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
      created_at: convertTimeZone(event.created_at, timeZone),
    }))

    return fetched(`Notes`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = SearchNotes
