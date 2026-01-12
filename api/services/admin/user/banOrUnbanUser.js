const BanHistory = require("../../../models/BanHistory")
const User = require("../../../models/User")
const findUser = require("../../user/get/findUser")
const { sendBanEmail, sendUnbanEmail } = require("../../../utils/emailHandler")

const {
  admin: { maxReportMessageLength, defaultBannedById },
  errors: { notFound, inputTooLong, unauthorized },
  success: { custom },
} = require("../../../../constants/index")

const banOrUnbanUser = async (props) => {
  const { username: userInput, message: reason, loggedUser } = props

  if (reason.length > maxReportMessageLength) return inputTooLong("Reason")

  try {
    const user = await findUser({ userInput })
    if (!user) return notFound("User")

    if (user.roles.indexOf("admin") == -1)
      return unauthorized(`ban user`, `you can not ban an admin`)

    if (!user.banned) {
      const newBanHistoryRelation = new BanHistory({
        entity_type: "user",
        action_type: "unban",
        entity_id: user._id,

        banned_by: loggedUser?._id || defaultBannedById,
        ban_date: Date.now(),
        ban_message: reason,
      })
      newBanHistoryRelation.save()

      // unban user
      await User.updateOne({ _id: user._id }, { banned: false })

      await sendUnbanEmail({
        username: user.username,
        email: user.email,
        reason,
      })

      return custom(`${user.username} unbanned successfully`)
    }

    // Ban user
    const newBanHistoryRelation = new BanHistory({
      entity_type: "user",
      action_type: "ban",
      entity_id: user._id,

      banned_by: loggedUser?._id || defaultBannedById,
      ban_date: Date.now(),
      ban_message: reason,
    })
    await newBanHistoryRelation.save()

    // ban user
    await User.updateOne({ _id: user._id }, { banned: true })

    await sendBanEmail({
      username: bannedUser.username,
      email: bannedUser.email,
      reason,
    })

    return custom(`${user.username} banned successfully`)
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = banOrUnbanUser
