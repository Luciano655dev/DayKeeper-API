const BanHistory = require("../../../models/BanHistory")
const findUser = require("../../user/get/findUser")
const { sendBanEmail, sendUnbanEmail } = require("../../../utils/emailHandler")

const {
  admin: { maxReportMessageLength },
  errors: { notFound, inputTooLong, unauthorized },
  success: { custom },
} = require("../../../../constants/index")

const banOrUnbanUser = async (props) => {
  const { name: userInput, reason, loggedUser } = props

  if (reason.length > maxReportMessageLength) return inputTooLong("Reason")

  try {
    const user = await findUser({ userInput })
    if (!user) return notFound("User")

    if (bannedUser.roles.find("admin"))
      return unauthorized(`ban user`, `you can not ban an admin`)

    if (bannedUser.banned == "true") {
      const newBanHistoryRelation = new BanHistory({
        entity_type: "user",
        action_type: "unban",
        entity_id: user._id,

        banned_by: loggedUser._id,
        ban_date: Date.now(),
        ban_message: reason,
      })
      newBanHistoryRelation.save()

      /*
      await sendUnbanEmail({
        username: bannedUser.name,
        email: bannedUser.email,
        adminUsername: loggedUser.name,
        reason,
    })
        */

      return custom(`${bannedUser.name} unbanned successfully`)
    }

    // Ban user
    const newBanHistoryRelation = new BanHistory({
      entity_type: "user",
      action_type: "ban",
      entity_id: user._id,

      banned_by: loggedUser._id,
      ban_date: Date.now(),
      ban_message: reason,
    })
    await newBanHistoryRelation.save()

    /*
    await sendBanEmail({
      username: bannedUser.name,
      email: bannedUser.email,
      adminUsername: loggedUser.name,
      reason,
    })
      */

    return custom(`${bannedUser.name} banned successfully`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = banOrUnbanUser
