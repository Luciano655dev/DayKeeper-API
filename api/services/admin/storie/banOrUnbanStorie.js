const User = require(`../../../models/User`)
const BanHistory = require(`../../../models/BanHistory`)
const Storie = require(`../../../models/Storie`)

const {
  sendStorieBanEmail,
  sendStorieUnbanEmail,
} = require(`../../../utils/emailHandler`)
const {
  admin: { maxReportMessageLength },
  errors: { inputTooLong, notFound, invalidValue },
  success: { custom },
} = require(`../../../../constants/index`)

const banOrUnbanStorie = async (props) => {
  const { storieId, reason, loggedUser } = props

  if (reason.length > maxReportMessageLength) return inputTooLong(`Message`)

  try {
    const storie = await Storie.findById(storieId).populate(`user`)
    if (!storie) return notFound(`Storie`)

    if (storie.banned == "true") {
      // UNBAN STORIE
      const newBanHistoryRelation = new BanHistory({
        entity_type: "storie",
        action_type: "unban",
        entity_id: storie._id,

        unbanned_by: loggedUser._id,
        unban_date: Date.now(),
        uban_message: reason,
      })
      await newBanHistoryRelation.save()

      await sendStorieUnbanEmail({
        username: deletedStorie.user.name,
        email: deletedStorie.user.email,
        title: deletedStorie.title,
        id: deletedStorie._id,
        adminUsername: loggedUser.name,
        reason,
      })

      return custom(
        `${storie.user.name}'s Storie from ${storie.title} with the id "${storie._id}" unbanned successfully`
      )
    }

    // BAN HISTORIE
    const newBanHistoryRelation = new BanHistory({
      entity_type: "storie",
      action_type: "ban",
      entity_id: storie._id,

      banned_by: loggedUser._id,
      ban_date: Date.now(),
      ban_message: reason,
    })

    await newBanHistoryRelation.save()

    await sendStorieBanEmail({
      username: deletedStorie.user.name,
      email: deletedStorie.user.email,
      title: deletedStorie.title,
      id: deletedStorie._id,
      adminUsername: loggedUser.name,
      reason,
    })

    return custom(
      `${deletedStorie.user.name}'s Storie from ${deletedStorie.title} banned successfully`
    )
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = banOrUnbanStorie
