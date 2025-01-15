const PostComments = require("../../models/PostComments")
const getPost = require("./getPost")
const deleteCommentLikes = require("./delete/deleteCommentLikes")
const axios = require("axios")
const {
  giphy: { apiKey },
} = require("../../../config")

const {
  post: { maxCommentLength },
  errors: { fieldsNotFilledIn, inputTooLong, notFound },
  errorGif,
  success: { created, deleted },
} = require("../../../constants/index")

const commentPost = async (props) => {
  let { postId, loggedUser, comment, gif } = props

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

    /* Create Comment Relation */
    const commentRelation = await PostComments.findOne({
      userId: loggedUser._id,
      postId: post._id,
    })

    if (commentRelation) {
      // delete comment
      await deleteCommentLikes(commentRelation._id)
      await PostComments.deleteOne({ userId: loggedUser._id, postId: post._id })

      return deleted("Comment", { response: { post, comment: newComment } })
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
        gif = errorGif

        /* Error in Giphy API debug */
        console.Error(err)
      }
    }

    const newComment = new PostComments({
      userId: loggedUser._id,
      postUserId: post.user_info._id,
      postId: post._id,
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
