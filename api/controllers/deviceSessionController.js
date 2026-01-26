const {
  errors: { serverError },
} = require("../../constants/index")

const getDeviceSessions = require("../services/deviceSession/getDeviceSessions")
const revokeDeviceSession = require("../services/deviceSession/revokeDeviceSession")
const revokeAllDeviceSessions = require("../services/deviceSession/revokeAllDeviceSessions")

const getDeviceSessionsController = async (req, res) => {
  const page = Number(req.query?.page) || 1
  const maxPageSize = req.query?.maxPageSize
    ? Number(req.query?.maxPageSize) <= 100
      ? Number(req.query?.maxPageSize)
      : 100
    : 1

  try {
    const { code, message, response } = await getDeviceSessions({
      loggedUser: req.user,
      page,
      maxPageSize,
    })

    return res.status(code).json({ message, ...response })
  } catch (error) {
    return res.status(500).json({ message: serverError(String(error)) })
  }
}

const revokeDeviceSessionController = async (req, res) => {
  try {
    const { code, message, id } = await revokeDeviceSession({
      loggedUser: req.user,
      sessionId: req.params?.id,
    })

    return res.status(code).json({ message, id })
  } catch (error) {
    return res.status(500).json({ message: serverError(String(error)) })
  }
}

const revokeAllDeviceSessionsController = async (req, res) => {
  try {
    const { code, message, matched, modified } = await revokeAllDeviceSessions({
      loggedUser: req.user,
    })

    return res.status(code).json({ message, matched, modified })
  } catch (error) {
    return res.status(500).json({ message: serverError(String(error)) })
  }
}

module.exports = {
  getDeviceSessions: getDeviceSessionsController,
  revokeDeviceSession: revokeDeviceSessionController,
  revokeAllDeviceSessions: revokeAllDeviceSessionsController,
}
