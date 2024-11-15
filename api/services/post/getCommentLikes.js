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
  const { title, name, usercomment, loggedUser, page, maxPageSize } = props

  try {
    const post = await Post.aggregate(getPostPipeline(name, title, loggedUser))
    if (!post) return notFound("Post")

    const usersThatLiked = await getDataWithPages({
      pipeline: getCommentLikesPipeline(usercomment),
      type: "CommentLikes",
      page,
      maxPageSize,
    })

    return fetched(`Comment Likes`, {
      response: {
        post,
        ...usersThatLiked,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getCommentLikes
