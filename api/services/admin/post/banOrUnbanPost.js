const Post = require("../../../models/Post")
const findPost = require("../../post/get/findPost")
const findUser = require("../../user/get/findUser")
const BanHistory = require("../../../models/BanHistory")

const {
  sendPostBanEmail,
  sendPostUnbanEmail,
} = require(`../../../utils/emailHandler`)
const {
  admin: { maxReportMessageLength },
  errors: { inputTooLong, notFound },
  success: { custom },
} = require(`../../../../constants/index`)

const banOrUnbanPost = async (props) => {
  const { name: userInput, title, reason, loggedUser } = props

  if (reason.length > maxReportMessageLength) return inputTooLong(`Reason`)

  try {
    const user = await findUser({ userInput })
    if (!user) return notFound(`User`)
    const post = await findPost({
      userInput,
      title,
      populate: ["user"],
    })
    if (!post) return notFound(`Post`)

    if (post.banned == "true") {
      // Create unban relation
      const newBanHistoryRelation = new BanHistory({
        entity_type: "post",
        action_type: "unban",
        entity_id: post._id,

        unbanned_by: loggedUser._id,
        unban_date: Date.now(),
        uban_message: reason,
      })
      await newBanHistoryRelation.save()

      await Post.updateOne({ _id: post._id }, { banned: false })

      /*
      await sendPostUnbanEmail({
        username: post.username,
        email: post.email,
        title: post.title,
        id: post.id,
        adminUsername: loggedUser.name,
        reason,
      })
        */

      return custom(
        `${user.name}'s post from ${post.title} unbanned successfully`
      )
    }

    const newBanHistoryRelation = new BanHistory({
      entity_type: "post",
      action_type: "ban",
      entity_id: post._id,

      banned_by: loggedUser._id,
      ban_date: Date.now(),
      ban_message: reason,
    })
    await newBanHistoryRelation.save()

    await Post.updateOne({ _id: post._id }, { banned: true })

    /*
    await sendPostBanEmail({
      username: post.username,
      email: post.email,
      title: post.title,
      id: post.id,
      adminUsername: loggedUser.name,
      reason,
    })
    */

    return custom(`${user.name}'s post from ${post.title} banned successfully`)
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = banOrUnbanPost
