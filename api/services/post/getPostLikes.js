const getPost = require("./getPost")
const getDataWithPages = require("../getDataWithPages")
const { getPostLikesPipeline } = require("../../repositories/index")
const mongoose = require("mongoose")

const {
  success: { fetched },
} = require("../../../constants/index")

const getPostLikes = async (props) => {
  const { postId, loggedUser, page, maxPageSize } = props

  try {
    /* Validate Post */
    if (!mongoose.Types.ObjectId.isValid(postId)) return invalidValue("Post ID")
    const postResponse = await getPost({ postId, loggedUser })
    if (postResponse.code != 200) return notFound("Post")

    // Get Likes
    const usersThatLiked = await getDataWithPages({
      pipeline: getPostLikesPipeline(postId, loggedUser),
      type: "PostLikes",
      page,
      maxPageSize,
    })

    return fetched(`Post Likes`, {
      response: {
        ...usersThatLiked,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPostLikes
