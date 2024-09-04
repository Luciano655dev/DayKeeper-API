const PostComments = require("../../models/PostComments")
const findUser = require("../user/get/findUser")
const findPost = require("./get/findPost")
const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../constants/index")

const deleteComment = async (props) => {
  const {
    name: username,
    title,
    usercomment: usernameThatCommented,
    loggedUser,
  } = props

  try {
    const userThatCommented = await findUser({
      userInput: usernameThatCommented,
    })

    const post = await findPost({
      userInput: username,
      title,
      type: "username",
      fieldsToPopulate: ["user"],
    })

    if (!post) return notFound("Post")
    if (!userThatCommented) return notFound("User")

    /* Find comment index */
    const comment = await PostComments.exists({
      postId: post._id,
      userId: userThatCommented._id,
    })
    if (!comment) return notFound("Comment")

    /* Verify if the user is the post owner or the comment owner */
    if (
      (!post.user._id.equals(loggedUser._id) || // if the user is not the post owner
        !loggedUser.private, // if the user is not private
      !comment.userId.equals(loggedUser._id))
    )
      return unauthorized(
        "You can not delete comments on this post",
        "You can only delete a comment if you made it or if you are the owner of the post and have a private account."
      )

    /* Remove user comment */
    await PostComments.deleteOne({
      postId: post._id,
      userId: userThatCommented._id,
    })

    return deleted(`Comment`, { post })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = deleteComment
