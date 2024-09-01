const User = require("../../models/User")
const findPost = require("./get/findPost")
const {
  errors: { notFound },
  success: { custom },
} = require("../../../constants/index")

const reactComment = async (props) => {
  const { name: username, title, usercomment, loggedUser } = props

  try {
    const userComment = await User.findOne({ name: usercomment })
    if (!userComment) return notFound("User")

    const post = await findPost({
      userInput: username,
      title,
      type: "username",
      fieldsToPopulate: ["user", "comments.user"],
    })
    if (!post) return notFound("Post")

    const userCommentId = userComment._id.toString()
    const comment = post.comments.find(
      (comment) => comment.user._id == userCommentId
    )
    if (!comment) return notFound("Comment")

    const userLikeIndex = comment.likes.indexOf(loggedUser._id)

    if (userLikeIndex > -1)
      // add like
      comment.likes.splice(userLikeIndex, 1)
    // remove like
    else comment.likes.push(loggedUser._id)

    await post.save()
    return custom("The like was added or removed from the comment", 200, {
      post,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reactComment
