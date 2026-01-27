const getPost = require("./getPost")
const getDataWithPages = require("../getDataWithPages")
const { getPostCommentsPipeline } = require("../../repositories/index")
const mongoose = require("mongoose")

const {
  success: { fetched },
  errors: { invalidValue, notFound },
} = require("../../../constants/index")

const getPostComments = async (props) => {
  const { postId, loggedUser, page, maxPageSize } = props

  try {
    /* Validate Post */
    if (!mongoose.Types.ObjectId.isValid(postId)) return invalidValue("Post ID")
    const postResponse = await getPost({ postId, loggedUser })
    if (postResponse.code != 200) return notFound("Post")

    // get comments
    const comments = await getDataWithPages({
      pipeline: getPostCommentsPipeline({
        postId,
        parentCommentId: null,
        mainUser: loggedUser,
      }),
      type: "PostComments",
      page,
      maxPageSize,
    })

    return fetched(`Post Comments`, {
      response: {
        ...comments,
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPostComments
