const Notification = require("../../models/Notification")
const sendNotification = require("../../utils/sendNotification")

const createNotification = async ({
  userId,
  type,
  title,
  body,
  data,
  sendPush = true,
}) => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    body,
    data: data || null,
  })

  if (sendPush) {
    await sendNotification(userId, { title, body }, data)
  }

  return notification
}

module.exports = createNotification
