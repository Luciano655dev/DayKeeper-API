const User = require(`../../../models/User`)
const Post = require(`../../../models/Post`)

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
  const { name: username, posttitle, reason, loggedUser } = props

  if (reason.length > maxReportMessageLength) return inputTooLong(`Reason`)

  try {
    const userPost = await User.findOne({ name: username })
    if (!userPost) return notFound(`User`)

    const deletedPost = await Post.findOne({
      title: posttitle,
      user: userPost._id,
    })
    if (!deletedPost) return notFound(`User`)

    if (deletedPost.banned == "true") {
      await Post.updateOne(
        {
          title: posttitle,
          user: userPost._id,
        },
        {
          $set: {
            banned: false,
            "ban_history.$[elem].unban_date": Date.now(),
            "ban_history.$[elem].unbanned_by": loggedUser._id,
            "ban_history.$[elem].unban_message": message,
          },
        },
        {
          arrayFilters: [{ "elem.unban_date": { $exists: false } }],
        }
      )

      await sendPostUnbanEmail({
        username: userPost.username,
        email: userPost.email,
        title: deletedPost.title,
        id: deletedPost.id,
        adminUsername: loggedUser.name,
        reason,
      })

      return custom(
        `${userPost.name}'s post from ${deletedPost.title} unbanned successfully`
      )
    }

    await Post.updateOne(
      {
        title: posttitle,
        user: userPost._id,
      },
      {
        $set: {
          banned: true,
        },
        $push: {
          ban_history: {
            banned_by: loggedUser._id,
            ban_date: Date.now(),
            ban_message: message,
          },
        },
      }
    )

    await sendPostBanEmail({
      username: userPost.username,
      email: userPost.email,
      title: deletedPost.title,
      id: deletedPost.id,
      adminUsername: loggedUser.name,
      reason,
    })

    return custom(
      `${userPost.name}'s post from ${deletedPost.title} banned successfully`
    )
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = banOrUnbanPost
