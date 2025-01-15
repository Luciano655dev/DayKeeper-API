const Post = require("../../models/Post")
const findUser = require("../user/get/findUser")
const getDataWithPages = require("../getDataWithPages")
const convertTimeZone = require(`../../utils/convertTimeZone`)
const {
  getCommentLikesPipeline,
  getPostPipeline,
} = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getCommentLikes = async (props) => {
  const { postId, userId, loggedUser, page, maxPageSize } = props

  try {
    const post = await Post.aggregate(getPostPipeline(postId, loggedUser))
    if (!post) return notFound("Post")

    const usersThatLiked = await getDataWithPages({
      pipeline: getCommentLikesPipeline(userId, postId),
      type: "CommentLikes",
      page,
      maxPageSize,
    })

    return fetched(`Comment Likes`, {
      response: {
        post: post[0],
        ...usersThatLiked,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getCommentLikes
