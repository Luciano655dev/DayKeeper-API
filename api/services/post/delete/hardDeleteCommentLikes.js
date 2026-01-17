const CommentLikes = require("../../../models/CommentLikes")

async function hardDeleteCommentLikes({ postId }) {
  const res = await CommentLikes.deleteMany({ postId })
  return res.deletedCount || 0
}

module.exports = hardDeleteCommentLikes
