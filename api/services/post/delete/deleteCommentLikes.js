const CommentLikes = require("../../../models/CommentLikes")

const deleteCommentLikes = async (id) => {
  try {
    const response = await CommentLikes.deleteMany({
      $and: [{ $or: [{ commentId: id }, { postId: id }] }, { postUserId: id }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteCommentLikes
