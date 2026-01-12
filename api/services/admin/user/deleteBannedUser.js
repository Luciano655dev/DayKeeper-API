const User = require("../../../models/User")
const findUser = require("../../user/get/findUser")
const BanHistory = require("../../../models/BanHistory")
const BannedUser = require("../../../models/BannedUser")
const deleteUser = require("../../user/deleteUser")
const { differenceInDays } = require("date-fns")
const { sendUserDeletionEmail } = require("../../../utils/emailHandler")

const {
  admin: { daysToDeleteBannedUser },
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../../constants/index")

const deleteBannedUser = async (props) => {
  const { username: userInput, loggedUser, message } = props

  try {
    const user = await findUser({ userInput })

    if (!user) return notFound("User")
    if (!user.banned)
      return unauthorized(`delete user`, `this user isn't banned`)

    const latestBan = await BanHistory.findOne({
      entity_type: "user",
      action_type: "ban",
      entity_id: user._id,
      ban_date: { $exists: true },
    }).sort({ ban_date: -1 })
    if (!latestBan) return notFound("Ban History")

    let adminUser = await User.findById(latestBan.banned_by)
    if (!adminUser) adminUser = loggedUser

    if (adminUser?._id != loggedUser._id)
      return unauthorized(
        `delete user`,
        "Only the admin who banned the user can delete it"
      )

    const diffInDays = differenceInDays(new Date(), latestBan.ban_date)
    if (diffInDays < daysToDeleteBannedUser)
      return unauthorized(
        `delete user`,
        `You can only delete a user if they are banned for more than ${daysToDeleteBannedUser} days`
      )

    // Delete User
    await deleteUser({ loggedUser: user._id })

    const newBannedUser = new BannedUser({
      email: user.email,
      ban_message: latestBan.ban_message,
      ban_date: latestBan.ban_date,
      banned_by: latestBan.banned_by,
    })
    await newBannedUser.save()

    // bannedUser.ban_message
    await sendUserDeletionEmail({
      username: user.username,
      email: user.email,
      adminUsername: adminUser.username,
      reason: latestBan.ban_message,
      message,
    })

    return deleted(`Banned user`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteBannedUser
