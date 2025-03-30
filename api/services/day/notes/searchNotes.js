const User = require("../../../models/User")
const { searchNotePipeline } = require("../../../repositories/index")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const getDataWithPages = require("../../getDataWithPages")

const {
  user: { defaultTimeZone },
  success: { fetched },
} = require("../../../../constants/index")

const searchNotes = async (props) => {
  const { page, maxPageSize, name, loggedUser } = props
  const searchQuery = props.q || ""
  const filter = props?.filter || "" // `upcoming` or `past`

  try {
    // get user
    let user = loggedUser
    if (name) {
      user = await User.findOne({ name })
      if (!user) return notFound("User")
    }

    // filter
    let filterPipe = {}
    switch (filter) {
      case "upcoming":
        filterPipe = {
          $expr: {
            $gt: [{ $toDate: "$date" }, new Date()],
          },
        }
        break
      case "past":
        filterPipe = {
          $expr: {
            $lt: [{ $toDate: "$date" }, new Date()],
          },
        }
        break
      default:
        filterPipe = {}
        break
    }

    const response = await getDataWithPages(
      {
        type: "DayNote",
        pipeline: searchNotePipeline(searchQuery, filterPipe, user, loggedUser),
        page,
        maxPageSize,
      },
      loggedUser
    )
    console.log(response)

    return fetched(`Notes`, { response })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = searchNotes
