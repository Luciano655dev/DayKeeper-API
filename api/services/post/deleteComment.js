const User = require("../../models/User")
const findPost = require("./get/findPost")
const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../constants/index")

const deleteComment = async (props) => {
  const { name: username, title, usercomment, loggedUser } = props

  try {
    const userComment = await User.findOne({ name: usercomment })

    const post = await findPost({
      userInput: username,
      title,
      type: "username",
      fieldsToPopulate: ["user"],
    })

    /* Find comment index */
    const userCommentIndex = post.comments.findIndex(
      (comment) => comment.user.toString() == userComment._id.toString()
    )
    if (userCommentIndex === -1) return notFound("Comment")

    /* Verify if the user is the post owner or the comment owner */
    if (
      post.user._id.toString() !== loggedUser._id.toString() ||
      post.comments[userCommentIndex].user.toString() !==
        loggedUser._id.toString()
    )
      return unauthorized("You can not delete comments on this post")

    /* Remove user comment */
    post.comments.splice(userCommentIndex, 1)

    /* Update */
    await post.save()

    return deleted(`Comment`, { post })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = deleteComment
