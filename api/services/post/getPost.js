const PostLikes = require("../../models/PostLikes")
const PostComments = require("../../models/PostComments")
const findPost = require("./get/findPost")
const convertTimeZone = require("../../utils/convertTimeZone")

const {
  user: { defaultTimeZone },
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getPost = async ({ title, name: username, loggedUserId }) => {
  try {
    const post = await findPost({ userInput: username, title })
    if (!post) return notFound("Post")

    const [likeCount, hasLiked, commentCount, userComment] = await Promise.all([
      PostLikes.countDocuments({ postId: post._id }),
      PostLikes.exists({ postId: post._id, userId: loggedUserId }),
      PostComments.countDocuments({ postId: post._id }),
      PostComments.findOne({ postId: post._id, userId: loggedUserId }),
    ])

    const postWithExtras = {
      ...post._doc,
      created_at: convertTimeZone(
        post.created_at,
        post.user?.timeZone || defaultTimeZone
      ),
      likes: likeCount,
      hasLiked,
      comments: commentCount,
      userComment,
    }

    return fetched("post", { post: postWithExtras })
  } catch (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

module.exports = getPost
