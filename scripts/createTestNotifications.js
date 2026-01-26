require("dotenv").config()

const mongoose = require("mongoose")
const User = require("../api/models/User")
const Notification = require("../api/models/Notification")

const username = "luciano"

const sampleNotifications = [
  {
    type: "new_follower",
    title: "New follower!",
    body: "maria started following you",
    data: { followerId: "user_1", username: "maria" },
  },
  {
    type: "follow_request",
    title: "You received a new follow request",
    body: "joao is asking to follow you",
    data: { followerId: "user_2", username: "joao" },
  },
  {
    type: "follow_request_accepted",
    title: "luciano accepted your follow request",
    body: "You're now following luciano!",
    data: { followingId: "user_3", username: "luciano" },
  },
  {
    type: "post_liked",
    title: "Your post got a like",
    body: "ana liked your post",
    data: { postId: "post_123", username: "ana" },
  },
  {
    type: "comment",
    title: "New comment",
    body: "bruno commented on your post",
    data: { postId: "post_456", username: "bruno" },
  },
  {
    type: "reminder",
    title: "Daily check-in",
    body: "Don't forget to log your day.",
    data: { reminderId: "rem_001" },
  },
]

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in env")
  }

  await mongoose.connect(process.env.MONGODB_URI)

  const user = await User.findOne({ username })
  if (!user) {
    throw new Error(`User \"${username}\" not found`)
  }

  const docs = sampleNotifications.map((notification, index) => ({
    user: user._id,
    ...notification,
    read: index % 2 === 0,
    created_at: new Date(Date.now() - index * 60 * 60 * 1000),
  }))

  const created = await Notification.insertMany(docs)
  console.log(`Created ${created.length} notifications for ${username}`)

  await mongoose.disconnect()
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
