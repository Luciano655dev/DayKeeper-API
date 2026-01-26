const RefreshToken = require("../../models/RefreshToken")
const {
  errors: { unauthorized },
  success: { updated },
} = require("../../../constants/index")

const revokeAllDeviceSessions = async (props) => {
  const { loggedUser } = props

  if (!loggedUser?._id) return unauthorized("revoke sessions")

  const result = await RefreshToken.updateMany(
    { user: loggedUser._id, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  )

  return updated("sessions", {
    matched: result.matchedCount ?? result.n,
    modified: result.modifiedCount ?? result.nModified,
  })
}

module.exports = revokeAllDeviceSessions
