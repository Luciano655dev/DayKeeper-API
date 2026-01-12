const User = require("../../models/User")
const PostComments = require("../../models/PostComments")
const CommentLikes = require("../../models/CommentLikes")
const getUser = require("../user/getUser")
const getPost = require("./getPost")

const {
  errors: { notFound },
  success: { custom },
} = require("../../../constants/index")

const likeComment = async (props) => {
  console.log("hewo")
  const { postId, userId, loggedUser } = props

  try {
    /* Find User */
    const fetchedUser = await User.findById(userId)
    if (!fetchedUser) return notFound("User")
    const userThatCommented = await getUser({
      username: fetchedUser.username,
      loggedUser,
    })
    if (!userThatCommented) return notFound("User")

    /* Find Post */
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    /* Create Comment Like Relation */
    const comment = await PostComments.exists({
      userId,
      postId: post._id,
    })
    console.log(userThatCommented)

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

      return custom("The like was removed from the comment", {
        post,
      })
    }

    const newLikeRelation = new CommentLikes({
      userId: loggedUser._id,
      postId: post._id,
      postUserId: post.user_info._id,
      commentId: comment._id,
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
