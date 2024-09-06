const PostLikes = require("../../../models/PostLikes")

const deletePostLikes = async (commentId) => {
  try {
    const response = await PostLikes.deleteMany({ commentId })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePostLikes
