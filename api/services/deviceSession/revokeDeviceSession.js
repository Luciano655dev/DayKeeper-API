const RefreshToken = require("../../models/RefreshToken")
const {
  errors: { unauthorized, fieldNotFilledIn, notFound },
  success: { updated },
} = require("../../../constants/index")

const revokeDeviceSession = async (props) => {
  const { loggedUser, sessionId } = props

  if (!loggedUser?._id) return unauthorized("revoke session")
  if (!sessionId) return fieldNotFilledIn("sessionId")

  const session = await RefreshToken.findOneAndUpdate(
    { _id: sessionId, user: loggedUser._id },
    { $set: { revokedAt: new Date() } },
    { new: true }
  ).select("_id")

  if (!session) return notFound("Session")

  return updated("session", { id: session._id })
}

module.exports = revokeDeviceSession
