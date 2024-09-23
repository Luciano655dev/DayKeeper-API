const PostLikes = require("../../models/PostLikes")
const PostComments = require("../../models/PostComments")
const findPost = require("./get/findPost")
const convertTimeZone = require(`../../utils/convertTimeZone`)

const {
  user: { defaultTimeZone },
} = require("../../../constants/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getPost = async (props) => {
  const { title, name: username, loggedUserId } = props

  try {
    const post = await findPost({
      userInput: username,
      title,
    })

    if (!post) return notFound("Post")

    const likeCounter = await PostLikes.countDocuments({ postId: post._id })
    const hasLiked = await PostLikes.exists({
      postId: post._id,
      userId: loggedUserId,
    })

    const commentCounter = await PostComments.countDocuments({
      postId: post._id,
    })
    const userComment = await PostComments.findOne({
      postId: post._id,
      userId: loggedUserId,
    })

    return fetched(`post`, {
      post: {
        ...post._doc,
        created_at: convertTimeZone(
          post.created_at,
          post.user?.timeZone || defaultTimeZone
        ),
        likes: likeCounter,
        hasLiked,
        comments: commentCounter,
        userComment,
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error(error.message)
  }
}

module.exports = getPost
