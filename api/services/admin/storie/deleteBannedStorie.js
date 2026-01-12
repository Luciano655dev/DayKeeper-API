const User = require(`../../../models/User`)
const Storie = require(`../../../models/Storie`)
const BanHistory = require(`../../../models/BanHistory`)
const findUser = require("../../user/get/findUser")
const deleteStorie = require("../../stories/deleteStories")

const { differenceInDays } = require("date-fns")
const { sendStorieDeletionEmail } = require(`../../../utils/emailHandler`)

const {
  admin: { maxReportMessageLength, daysToDeleteBannedStorie },
  errors: { inputTooLong, notFound, unauthorized },
  success: { deleted },
} = require(`../../../../constants/index`)

const deleteBannedStorie = async (props) => {
  const { username: userInput, storieId, message, loggedUser } = props

  if (message.length > maxReportMessageLength) return inputTooLong(`Message`)

  try {
    const user = await findUser({ userInput })
    if (!user) return notFound(`User`)

    const storie = await Storie.findById(storieId)
    if (!storie) return notFound(`Storie`)

    if (!storie.banned)
      return unauthorized(`delete this Storie`, `this Storie isn't banned`)

    const latestBan = await BanHistory.findOne({
      entity_type: "storie",
      action_type: "ban",
      entity_id: post._id,
      ban_date: { $exists: true },
    }).sort({ ban_date: -1 })
    if (!latestBan) return notFound("Ban History")

    if (!latestBan.banned_by.equals(loggedUser._id))
      return unauthorized(
        `delete this Storie`,
        "Only the admin who banned this Storie can delete it"
      )

    const diffInDays = differenceInDays(new Date(), latestBan.ban_date)
    if (diffInDays < daysToDeleteBannedStorie)
      return unauthorized(
        `delete this Storie`,
        "You can only delete a Storie if it has been banned for 7 or more days"
      )

    // delete storie
    await deleteStorie({ storieId: storieId._id })

    const adminUser = await User.findById(latestBan.banned_by)
    if (!adminUser) adminUser = loggedUser

    sendStorieDeletionEmail({
      date: storie.date,
      username: storie.user_info.username,
      email: storie.user_info.email,
      id: storie._id,
      adminUsername: adminUser.username,
      reason: latestBan.ban_message,
      message,
    })

    return deleted(`Storie`, { storie })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteBannedStorie
