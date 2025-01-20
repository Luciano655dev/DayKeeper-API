const User = require("../../../models/User")
const { searchEventPipeline } = require("../../../repositories/index")
const getDataWithPages = require("../../getDataWithPages")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../../constants/index")

const searchEvent = async (props) => {
  const { page, maxPageSize, name, loggedUser } = props
  const searchQuery = props.q || ""
  const filter = props?.filter || ""

  try {
    // get user
    let user = loggedUser
    if (name) {
      user = await User.findOne({ name })
      if (!user) return notFound("User")
    }

    let filterPipe = {}
    switch (filter) {
      case "upcoming":
        filterPipe = { dateStart: { $gt: new Date() } }
        break
      case "past":
        filterPipe = { dateStart: { $lt: new Date() } }
        break
      case "ongoing":
        filterPipe = {
          $and: [
            { dateStart: { $lt: new Date() } },
            { dateEnd: { $gt: new Date() } },
          ],
        }
        break
      default:
        break
    }

    const response = await getDataWithPages(
      {
        type: "DayEvent",
        pipeline: searchEventPipeline(
          searchQuery,
          filterPipe,
          user,
          loggedUser
        ),
        page,
        maxPageSize,
      },
      loggedUser
    )

    return fetched(`Events`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = searchEvent
