const findPost = require("./get/findPost")
const getDataWithPages = require("../getDataWithPages")
const convertTimeZone = require(`../../utils/convertTimeZone`)
const { getPostLikesPipeline } = require("../../repositories/index")

const {
  errors: { notFound },
  success: { fetched },
} = require("../../../constants/index")

const getPostLikes = async (props) => {
  const { title, name: username, page, maxPageSize } = props

  try {
    const post = await findPost({
      userInput: username,
      title,
      type: "username",
    })

    if (!post) return notFound("Post")

    const usersThatLiked = await getDataWithPages({
      pipeline: getPostLikesPipeline(post._id),
      type: "PostLikes",
      page,
      maxPageSize,
    })

    return fetched(`Post Likes`, {
      response: {
        post: {
          ...post._doc,
          created_at: convertTimeZone(post.created_at, post.user.timeZone),
        },
        ...usersThatLiked,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPostLikes
