const findPost = require("./get/findPost")
const getDataWithPages = require("../getDataWithPages")
const convertTimeZone = require(`../../utils/convertTimeZone`)
const { getPostCommentsPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getPostComments = async (props) => {
  const { title, name: username, page, maxPageSize } = props

  try {
    const post = await findPost({
      userInput: username,
      title,
      type: "username",
    })

    if (!post) return notFound("Post")

    const comments = await getDataWithPages({
      pipeline: getPostCommentsPipeline(post._id),
      type: "PostComments",
      page,
      maxPageSize,
    })

    return fetched(`Post Comments`, {
      response: {
        post: {
          ...post._doc,
          created_at: convertTimeZone(post.created_at, post.user.timeZone),
        },
        comments,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPostComments
