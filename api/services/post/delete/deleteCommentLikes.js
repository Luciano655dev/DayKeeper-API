const CommentLikes = require("../../../models/CommentLikes")

const deleteCommentLikes = async (somethingId) => {
  try {
    const response = await CommentLikes.deleteMany({
      $or: [{ commentId: somethingId }, { postId: somethingId }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteCommentLikes
