const BanHistory = require(`../../../models/BanHistory`)
const Post = require("../../../models/Post")
const User = require("../../../models/User")
const getPost = require("../../post/getPost")

const deletePost = require("../../post/deletePost")

const { differenceInDays } = require("date-fns")
const { sendPostDeletionEmail } = require(`../../../utils/emailHandler`)
const {
  admin: { maxReportMessageLength, daysToDeleteBannedPost },
  errors: { inputTooLong, notFound, unauthorized },
  success: { deleted },
} = require(`../../../../constants/index`)

const deleteBannedPosts = async (props) => {
  const { postId, message, loggedUser } = props

  if (message.length > maxReportMessageLength) return inputTooLong(`Message`)

  try {
    // Get Post and User
    let post
    const postResponse = await getPost({ postId, loggedUser })
    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    const adminUser = await User.findById(latestBan.banned_by)

    if (!post.banned)
      return unauthorized(`delete this post`, `this post isn't banned`)

    const latestBan = await BanHistory.findOne({
      entity_type: "post",
      action_type: "ban",
      entity_id: post._id,
      ban_date: { $exists: true },
    }).sort({ ban_date: -1 })
    if (!latestBan) return notFound("Ban History")

    // VALIDATIONS
    if (!latestBan.banned_by.equals(loggedUser._id) && adminUser)
      return unauthorized(
        `delete this post`,
        "Only the admin who banned this post can delete it"
      )

    const diffInDays = differenceInDays(new Date(), latestBan.ban_date)
    if (diffInDays < daysToDeleteBannedPost)
      return unauthorized(
        `delete this post`,
        "You can only delete a post if it has been banned for 7 or more days"
      )

    // DELETE POST
    await deletePost({ postId: post._id, loggedUser })

    if (!adminUser) adminUser = loggedUser

    sendPostDeletionEmail({
      date: post.date,
      username: post.user_info.name,
      email: post.user_info.email,
      id: post._id,
      adminUsername: adminUser.name,
      reason: latestBan.ban_message,
      message,
    })

    return deleted(`Post`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteBannedPosts
