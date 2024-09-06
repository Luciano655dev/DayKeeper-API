const PostComments = require("../../models/PostComments")
const findPost = require("./get/findPost")
const findUser = require("../user/get/findUser")
const getDataWithPages = require("../getDataWithPages")
const convertTimeZone = require(`../../utils/convertTimeZone`)
const { getCommentLikesPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getCommentLikes = async (props) => {
  const {
    title,
    name: postUsername,
    usercomment: commentUsername,
    page,
    maxPageSize,
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

    const comment = await PostComments.findOne({
      postId: post._id,
      userId: userComment._id,
    })
    if (!comment) return notFound("Comment")

    const usersThatLiked = await getDataWithPages({
      pipeline: getCommentLikesPipeline(comment._id),
      type: "CommentLikes",
      page,
      maxPageSize,
    })

    return fetched(`Comment Likes`, {
      response: {
        post: {
          ...post._doc,
          created_at: convertTimeZone(post.created_at, post.user.timeZone),
        },
        users: usersThatLiked,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getCommentLikes
