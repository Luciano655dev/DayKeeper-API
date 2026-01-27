const PostComments = require("../../models/PostComments")
const CommentLikes = require("../../models/CommentLikes")
const getPost = require("./getPost")

const {
  errors: { notFound },
  success: { custom },
} = require("../../../constants/index")

const likeComment = async (props) => {
  const { commentId, loggedUser } = props

  try {
    /* Find Comment */
    const comment = await PostComments.findOne({
      _id: commentId,
      status: { $ne: "deleted" },
    })

    if (!comment) return notFound("Comment")

    /* Find Post */
    let post
    const postResponse = await getPost({ postId: comment.postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else {
      return notFound("Post")
    }

    const likeRelation = await CommentLikes.findOne({
      userId: loggedUser._id,
      postId: post._id,
      commentId: comment._id,
    })

    if (likeRelation && likeRelation.status !== "deleted") {
      likeRelation.status = "deleted"
      likeRelation.deletedAt = new Date()
      await likeRelation.save()
      return custom("The like was removed from the comment", {
        post,
      })
    }

    if (likeRelation && likeRelation.status === "deleted") {
      likeRelation.status = "public"
      likeRelation.deletedAt = null
      await likeRelation.save()
      return custom("The like was added to the comment", {
        post,
      })
    }

    const newLikeRelation = new CommentLikes({
      userId: loggedUser._id,
      postId: post._id,
      postUserId: post.user_info._id,
      commentId: comment._id,
      status: "public",
    })
    await newLikeRelation.save()

    return custom("The like was added to the comment", {
      post,
    })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = likeComment
