const PostComments = require("../../models/PostComments")
const deleteCommentLikes = require("./delete/deleteCommentLikes")
const User = require("../../models/User")
const getUser = require("../user/getUser")
const getPost = require("./getPost")
const {
  errors: { notFound, unauthorized },
  success: { deleted },
} = require("../../../constants/index")

const deleteComment = async (props) => {
  const { postId, userId, loggedUser } = props

  try {
    /* find User */
    const fetchedUser = await User.findById(userId)
    if (!fetchedUser) return notFound("User")
    const userThatCommented = await getUser({
      name: fetchedUser.name,
      loggedUser,
    })
    if (!userThatCommented) return notFound("User")

    /* find Post */
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    /* Find comment index */
    const comment = await PostComments.findOne({
      postId: post._id,
      userId,
    })
    if (!comment) return notFound("Comment")

    /* Verify if the user is the post owner or the comment owner */
    if (
      (!post.user_info._id == loggedUser._id || // if the user is not the post owner
        !loggedUser.private, // if the user is not private
      !comment.userId == loggedUser._id)
    )
      return unauthorized(
        "You can not delete comments on this post",
        "You can only delete a comment if you made it or if you are the owner of the post and have a private account."
      )

    /* Remove user comment */
    await deleteCommentLikes(comment._id)
    await PostComments.deleteOne({
      postId: post._id,
      userId,
    })

    return deleted(`Comment`, { response: { post, comment } })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = deleteComment
