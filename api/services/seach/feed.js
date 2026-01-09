const Followers = require("../../models/Followers")
const getDataWithPages = require("../getDataWithPages")
const { feedPostPipeline } = require("../../repositories/index.js")

const {
  success: { fetched },
} = require("../../../constants/index")

const feed = async (props) => {
  const page = Number(props.page) || 1
  const maxPageSize = props.maxPageSize
    ? Number(props.maxPageSize) <= 100
      ? Number(props.maxPageSize)
      : 100
    : 10

  const orderMode = (props.order || "recent").toLowerCase()
  const orderForPaging =
    orderMode === "relevant" || orderMode === "follow_first"
      ? "relevant"
      : "recent"
  const scope = (props.scope || "a").toLowerCase() // "following"
  const date = typeof props.date === "string" ? props.date.trim() : ""
  const dateStr = /^\d{2}-\d{2}-\d{4}$/.test(date) ? date : null

  const loggedUser = props.user

  try {
    loggedUser.following = await Followers.countDocuments({
      followerId: loggedUser._id,
    })

    const response = await getDataWithPages(
      {
        type: "Post",
        pipeline: feedPostPipeline(loggedUser, { scope, dateStr, orderMode }),
        orderForPaging,
        page,
        maxPageSize,
      },
      loggedUser
    )

    return fetched("data", { response })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = feed
