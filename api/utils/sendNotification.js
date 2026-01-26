const User = require("../models/User")
const admin = require("firebase-admin")

const sendNotification = async (userId, notification, data) => {
  try {
    const user = await User.findById(userId)

    if (!user || !user?.device_tokens || user?.device_tokens?.length === 0)
      return

    for (let userDeviceToken of user.device_tokens) {
      const payload = {
        notification,
        token: userDeviceToken,
      }

      if (data && typeof data === "object") {
        payload.data = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, String(value)])
        )
      }

      await admin.messaging().send(payload)
    }
  } catch (error) {
    console.error(
      `Error sending notification to user ${userId}:  ${error.message} `
    )
  }
}

module.exports = sendNotification
