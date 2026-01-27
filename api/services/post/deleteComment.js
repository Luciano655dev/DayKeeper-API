const PostComments = require("../../models/PostComments")
const deleteCommentLikes = require("./delete/deleteCommentLikes")
const getPost = require("./getPost")
const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../constants/index")

const deleteComment = async (props) => {
  const { commentId, loggedUser } = props

  try {
    /* Find comment index */
    const comment = await PostComments.findOne({
      _id: commentId,
      status: { $ne: "deleted" },
    })
    if (!comment) return notFound("Comment")

    /* find Post */
    let post
    const postResponse = await getPost({
      postId: comment.postId,
      loggedUser,
    })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    /* Verify if the user is the post owner or the comment owner */
    const isPostOwner = String(post.user_info._id) === String(loggedUser._id)
    const isCommentOwner = String(comment.userId) === String(loggedUser._id)

    if (!isCommentOwner && !(isPostOwner && loggedUser.private)) {
      return unauthorized(
        "You can not delete comments on this post",
        "You can only delete a comment if you made it or if you are the owner of the post and have a private account."
      )
    }

    /* Remove user comment */
    await deleteCommentLikes({ commentId: comment._id })
    comment.status = "deleted"
    comment.deletedAt = new Date()
    await comment.save()

    return deleted(`Comment`, { response: { post, comment } })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = deleteComment
