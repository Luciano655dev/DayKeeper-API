const PostComments = require("../../models/PostComments")
const axios = require("axios")
const findPost = require("./get/findPost")
const {
  giphy: { apiKey },
} = require("../../../config")

const {
  post: { maxCommentLength },
  errors: { fieldsNotFilledIn, inputTooLong, notFound },
  errroGif,
  success: { created, deleted },
} = require("../../../constants/index")

const commentPost = async (props) => {
  let { loggedUser, name: username, title, comment, gif } = props

  /* Validations */
  if (!comment) return fieldsNotFilledIn(`comment`)
  if (comment.length > maxCommentLength) return inputTooLong("Comment")

  try {
    const post = await findPost({
      userInput: username,
      title,
      type: "username",
      fieldsToPopulate: [],
    })
    if (!post) return notFound("Post")

    const userHasCommented = await PostComments.exists({
      userId: loggedUser._id,
      postId: post._id,
    })

    if (userHasCommented) {
      await PostComments.deleteOne({ userId: loggedUser._id, postId: post._id })
      return deleted("Comment")
    }

    /* Get Gif */
    if (gif) {
      try {
        gif = await axios.get(
          `https://api.giphy.com/v1/gifs/${gif}?api_key=${apiKey}`
        )

        gif = {
          name: gif.data.data.title,
          id: gif.data.data.id,
          url: gif.data.data.images.original.url,
        }
      } catch (err) {
        gif = errroGif

        /* Error in Giphy API debug */
        console.Error(err)
      }
    }

    const newComment = new PostComments({
      userId: loggedUser._id,
      postId: post._id,
      comment,
      gif,
    })
    await newComment.save()

    return created(`Comment`, { post })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = commentPost
