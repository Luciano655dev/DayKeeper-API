const getDataWithPages = require("../getDataWithPages")
const {
  errors: { unauthorized },
  success: { fetched },
} = require("../../../constants/index")

const getNotifications = async (props) => {
  const { loggedUser, page, maxPageSize, read } = props

  if (!loggedUser?._id) return unauthorized("fetch notifications")

  const match = { user: loggedUser._id }
  if (read === "true") match.read = true
  if (read === "false") match.read = false

  const response = await getDataWithPages({
    type: "Notification",
    pipeline: [{ $match: match }],
    page,
    maxPageSize,
    order: "recent",
  })

  return fetched("notifications", { response })
}

module.exports = getNotifications
