const PostComments = require("../../models/PostComments")
const getPost = require("./getPost")
const axios = require("axios")
const {
  giphy: { apiKey },
} = require("../../../config")

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

    if (parentCommentId) {
      const parent = await PostComments.findOne({
        _id: parentCommentId,
        postId: post._id,
        status: { $ne: "deleted" },
      })
      if (!parent) return notFound("Comment")
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

    return created(`Comment`, { response: { post, comment: newComment } })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = commentPost
