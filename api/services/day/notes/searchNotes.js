const User = require("../../../models/User")
const { searchNotePipeline } = require("../../../repositories/index")
const convertTimeZone = require(`../../../utils/convertTimeZone`)
const getDataWithPages = require("../../getDataWithPages")
const mongoose = require("mongoose")

const {
  user: { defaultTimeZone },
  success: { fetched },
} = require("../../../../constants/index")

const searchNotes = async (props) => {
  const { page, maxPageSize, name, loggedUser } = props
  const searchQuery = props.q || ""
  const filter = props?.filter || "upcoming" // `upcoming` or `past`

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
            $gt: ["$date", new Date()], // Compare directly as dates
          },
        }
        break
      case "past":
        filterPipe = {
          $expr: {
            $lt: ["$date", new Date()], // Compare directly as dates
          },
        }
        break
      default:
        break
    }

    const response = await getDataWithPages(
      {
        type: "DayNote",
        pipeline: searchNotePipeline(searchQuery, filterPipe, user, loggedUser),
        order: "recent",
        page,
        maxPageSize,
      },
      loggedUser
    )

    // Convert to TZ
    const timeZone = loggedUser?.timeZone || defaultTimeZone
    response.data = response.data.map((note) => ({
      ...note,
      created_at: convertTimeZone(note.created_at, timeZone),
    }))

    return fetched(`Notes`, { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = searchNotes
