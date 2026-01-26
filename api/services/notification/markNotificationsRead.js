const Notification = require("../../models/Notification")
const {
  errors: { unauthorized, fieldNotFilledIn },
  success: { updated },
} = require("../../../constants/index")

const markNotificationsRead = async (props) => {
  const { loggedUser, ids, all } = props

  if (!loggedUser?._id) return unauthorized("update notifications")

  if (!all && (!Array.isArray(ids) || ids.length === 0)) {
    return fieldNotFilledIn("ids")
  }

  let result
  if (all) {
    result = await Notification.updateMany(
      { user: loggedUser._id, read: false },
      { $set: { read: true } }
    )
  } else {
    result = await Notification.updateMany(
      { user: loggedUser._id, _id: { $in: ids } },
      { $set: { read: true } }
    )
  }

  return updated("notifications", {
    matched: result.matchedCount ?? result.n,
    modified: result.modifiedCount ?? result.nModified,
  })
}

module.exports = markNotificationsRead
