const Post = require("../../../models/Post")
const getPost = require("../../post/getPost")
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
  const { postId, reason, loggedUser } = props

  if (reason.length > maxReportMessageLength) return inputTooLong(`Reason`)

  try {
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    if (post.banned) {
      // Create unban relation
      const newBanHistoryRelation = new BanHistory({
        entity_type: "post",
        action_type: "unban",
        entity_id: post._id,

        unbanned_by: loggedUser?._id || defaultBannedById,
        unban_date: Date.now(),
        uban_message: reason,
      })
      await newBanHistoryRelation.save()

      await Post.updateOne({ _id: post._id }, { $set: { banned: false } })

      await sendPostUnbanEmail({
        username: post.user_info.username,
        email: post.user_info.email,
        date: post.date,
        id: post._id,
        adminUsername: loggedUser.username,
        reason,
      })

      return custom(
        `${post.user_info.username}'s post from ${post.date} unbanned successfully`
      )
    }

    const newBanHistoryRelation = new BanHistory({
      entity_type: "post",
      action_type: "ban",
      entity_id: post._id,

      banned_by: loggedUser?._id || defaultBannedById,
      ban_date: Date.now(),
      ban_message: reason,
    })
    await newBanHistoryRelation.save()

    await Post.updateOne({ _id: post._id }, { $set: { banned: false } })

    await sendPostBanEmail({
      username: post.user_info.username,
      email: post.user_info.email,
      date: post.date,
      id: post._id,
      adminUsername: loggedUser.username,
      reason,
    })

    return custom(
      `${post.user_info.username}'s post from ${post.date} banned successfully`
    )
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = banOrUnbanPost
