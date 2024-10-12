const { searchTaskPipeline } = require("../../../repositories/index")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const getDataWithPages = require("../../getDataWithPages")
const mongoose = require("mongoose")

const {
  user: { defaultTimeZone },
  errors: { invalidValue },
  success: { fetched },
} = require("../../../../constants/index")

const searchTasks = async (props) => {
  const { userId, page, maxPageSize } = props
  const searchQuery = props.q || ""
  const filter = props?.filter == "past" ? props?.filter : "upcoming" // `upcoming` or `past`
  const loggedUser = props.user

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) return invalidValue("User ID")
    userIdObjId = new mongoose.Types.ObjectId(userId)

    const response = await getDataWithPages(
      {
        type: "DayTask",
        pipeline: searchTaskPipeline(searchQuery, userIdObjId, filter),
        order: "recent",
        page,
        maxPageSize,
      },
      loggedUser
    )

    // Convert to TZ
    const timeZone = loggedUser?.timeZone || defaultTimeZone
    response.data = response.data.map((task) => ({
      ...task,
      created_at: convertTimeZone(task.created_at, timeZone),
    }))

    return fetched(`Tasks`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = searchTasks
