const PostComments = require("../../../models/PostComments")

const deletePostComments = async (postId) => {
  try {
    const response = await PostComments.deleteMany({ postId })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePostComments
