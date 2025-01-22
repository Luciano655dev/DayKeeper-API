const User = require("../../../models/User")
const { searchTaskPipeline } = require("../../../repositories/index")
const getDataWithPages = require("../../getDataWithPages")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../../constants/index")

const searchTasks = async (props) => {
  const { name, page, maxPageSize, loggedUser } = props
  const searchQuery = props.q || ""
  const filter = props?.filter == "past" ? props?.filter : "upcoming" // `upcoming` or `past`

  try {
    // get user
    let user = loggedUser
    if (name) {
      user = await User.findOne({ name })
      if (!user) return notFound("User")
    }

    // filter Pipe
    let filterPipe = {}
    switch (filter) {
      case "upcoming":
        filterPipe = {
          $expr: {
            $gt: ["$date", new Date()],
          },
        }
        break
      case "past":
        filterPipe = {
          $expr: {
            $lt: ["$date", new Date()],
          },
        }
        break
      default:
        break
    }

    const response = await getDataWithPages(
      {
        type: "DayTask",
        pipeline: searchTaskPipeline(searchQuery, filterPipe, user, loggedUser),
        order: "recent",
        page,
        maxPageSize,
      },
      loggedUser
    )

    return fetched(`Tasks`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = searchTasks
