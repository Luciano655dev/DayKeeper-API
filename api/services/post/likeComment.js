const PostComments = require("../../models/PostComments")
const CommentLikes = require("../../models/CommentLikes")
const findUser = require("../user/get/findUser")
const findPost = require("./get/findPost")

const {
  errors: { notFound },
  success: { custom },
} = require("../../../constants/index")

const likeComment = async (props) => {
  const {
    name: postUsername,
    title,
    usercomment: commentUsername,
    loggedUser,
  } = props

  try {
    const userComment = await findUser({ userInput: commentUsername })
    if (!userComment) return notFound("User")

    const post = await findPost({
      userInput: postUsername,
      title,
      type: "username",
    })
    if (!post) return notFound("Post")

    const comment = await PostComments.exists({
      userId: userComment._id,
      postId: post._id,
    })

    if (!comment) return notFound("Comment")

    const likeRelation = await CommentLikes.findOne({
      userId: loggedUser._id,
      postId: post._id,
      commentId: comment._id,
    })

    if (likeRelation) {
      await CommentLikes.deleteOne({
        userId: loggedUser._id,
        postId: post._id,
        commentId: comment._id,
      })

      return custom("The like was removed from the comment", 200, {
        post,
      })
    }

    const newLikeRelation = new CommentLikes({
      userId: loggedUser._id,
      postId: post._id,
      postUserId: post.user._id,
      commentId: comment._id,
    })
    await newLikeRelation.save()

    return custom("The like was added to the comment", 200, {
      post,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = likeComment
