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

const createNotificationWithLimits = async ({
  userId,
  type,
  title,
  body,
  data,
  actorId,
  targetId,
  debounceMs = 60 * 1000,
  windowMs = 60 * 60 * 1000,
  maxPerWindow = 30,
  sendPush = true,
}) => {
  const now = Date.now()

  if (actorId && targetId) {
    const recent = await Notification.findOne({
      user: userId,
      type,
      "data.actorId": actorId,
      "data.targetId": targetId,
      created_at: { $gte: new Date(now - debounceMs) },
    }).select("_id")

    if (recent) return null
  }

  const recentCount = await Notification.countDocuments({
    user: userId,
    type,
    created_at: { $gte: new Date(now - windowMs) },
  })

  if (recentCount >= maxPerWindow) return null

  return createNotification({ userId, type, title, body, data, sendPush })
}

module.exports = {
  createNotification,
  createNotificationWithLimits,
}
