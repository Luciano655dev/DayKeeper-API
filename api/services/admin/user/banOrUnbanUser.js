const BanHistory = require("../../../models/BanHistory")
const User = require("../../../models/User")
const findUser = require("../../user/get/findUser")
const { sendBanEmail, sendUnbanEmail } = require("../../../utils/emailHandler")

const {
  admin: { maxReportMessageLength },
  errors: { notFound, inputTooLong, unauthorized },
  success: { custom },
} = require("../../../../constants/index")

const banOrUnbanUser = async (props) => {
  const { name: userInput, message: reason, loggedUser } = props

  if (reason.length > maxReportMessageLength) return inputTooLong("Reason")

  try {
    const user = await findUser({ userInput })
    if (!user) return notFound("User")

    if (loggedUser.roles.indexOf("admin") == -1)
      return unauthorized(`ban user`, `you can not ban an admin`)

    if (user.banned == "true") {
      const newBanHistoryRelation = new BanHistory({
        entity_type: "user",
        action_type: "unban",
        entity_id: user._id,

        banned_by: loggedUser._id,
        ban_date: Date.now(),
        ban_message: reason,
      })
      newBanHistoryRelation.save()

      // unban user
      await User.updateOne({ _id: user._id }, { banned: false })

      /*
      await sendUnbanEmail({
        username: user.name,
        email: user.email,
        adminUsername: loggedUser.name,
        reason,
    })
        */

      return custom(`${user.name} unbanned successfully`, 200)
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

    // ban user
    await User.updateOne({ _id: user._id }, { banned: true })

    /*
    await sendBanEmail({
      username: bannedUser.name,
      email: bannedUser.email,
      adminUsername: loggedUser.name,
      reason,
    })
      */
    console.log("aqui")
    return custom(`${user.name} banned successfully`, 200)
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = banOrUnbanUser
