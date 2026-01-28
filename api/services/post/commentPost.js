const PostComments = require("../../models/PostComments")
const getPost = require("./getPost")
const axios = require("axios")
const {
  giphy: { apiKey },
} = require("../../../config")
const {
  createNotificationWithLimits,
} = require("../notification/createNotification")

const {
  post: { maxCommentLength },
  errors: { fieldsNotFilledIn, inputTooLong, notFound },
  errorGif,
  success: { created },
} = require("../../../constants/index")

const commentPost = async (props) => {
  let { postId, loggedUser, comment, gif, parentCommentId } = props

  /* Validations */
  if (!comment) return fieldsNotFilledIn(`comment`)
  if (comment.length > maxCommentLength) return inputTooLong("Comment")

  try {
    /* Get Post */
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    let parentComment = null
    if (parentCommentId) {
      parentComment = await PostComments.findOne({
        _id: parentCommentId,
        postId: post._id,
        status: { $ne: "deleted" },
      })
      if (!parentComment) return notFound("Comment")
    }

    /* Get Gif */
    if (gif) {
      try {
        gif = await axios.get(
          `https://api.giphy.com/v1/gifs/${gif}?api_key=${apiKey}`
        )

        gif = {
          title: gif.data.data.title,
          id: gif.data.data.id,
          url: gif.data.data.images.original.url,
        }
      } catch (err) {
        gif = errorGif

        /* Error in Giphy API debug */
        console.Error(err)
      }
    }

    const newComment = new PostComments({
      userId: loggedUser._id,
      postUserId: post.user_info._id,
      postId: post._id,
      parentCommentId: parentCommentId || null,
      comment,
      gif,
    })
    await newComment.save()

    // Notify post owner
    if (String(post.user_info._id) !== String(loggedUser._id)) {
      await createNotificationWithLimits({
        userId: post.user_info._id,
        type: "post_comment",
        title: "New comment",
        body: `@${loggedUser.username} commented on your post.`,
        data: {
          actorId: loggedUser._id,
          actorUsername: loggedUser.username,
          targetId: post._id,
          postId: post._id,
          commentId: newComment._id,
        },
        actorId: loggedUser._id,
        targetId: post._id,
        debounceMs: 30 * 1000,
        maxPerWindow: 60,
        windowMs: 60 * 60 * 1000,
      })
    }

    // Notify parent comment owner on reply
    if (
      parentComment &&
      String(parentComment.userId) !== String(loggedUser._id)
    ) {
      await createNotificationWithLimits({
        userId: parentComment.userId,
        type: "comment_reply",
        title: "New reply",
        body: `@${loggedUser.username} replied to your comment.`,
        data: {
          actorId: loggedUser._id,
          actorUsername: loggedUser.username,
          targetId: parentComment._id,
          postId: post._id,
          commentId: newComment._id,
          parentCommentId: parentComment._id,
        },
        actorId: loggedUser._id,
        targetId: parentComment._id,
        debounceMs: 30 * 1000,
        maxPerWindow: 60,
        windowMs: 60 * 60 * 1000,
      })
    }

    return created(`Comment`, { response: { post, comment: newComment } })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = commentPost
