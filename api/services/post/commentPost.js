const User = require("../../models/User")
const Post = require("../../models/Post")
const axios = require("axios")
const findPost = require("./get/findPost")
const {
  giphy: { apiKey },
} = require("../../../config")
const { hideUserData, hidePostData } = require("../../repositories")

const {
  post: { maxCommentLength },
  errors: { fieldsNotFilledIn, inputTooLong, notFound },
  errroGif,
  success: { created },
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
    }).select(hidePostData)
    const user = await User.findOne({ name: username })
    if (!post || !user) return notFound("Post or User")

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
        console.log(err)
      }
    }

    let newComments = [
      ...post.comments,
      {
        created_at: Date.now(),
        user: loggedUser._id,
        likes: [],
        comment,
        gif,
      },
    ]

    /* Remove user's comment if exists */
    if (
      post.comments.findIndex(
        (comment) => comment.user._id == loggedUser._id
      ) !== -1
    )
      newComments = [...post.comments].filter(
        (comment) => comment.user._id != loggedUser._id
      )

    const commentedPost = await Post.findOneAndUpdate(
      { title: title, user: user._id },
      {
        comments: newComments,
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: {
        path: "user",
        match: { banned: { $ne: true } },
        select: hideUserData,
      },
    })

    await commentedPost.save()

    return created(`comment`, { post: commentedPost })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = commentPost
