const CommentLikes = require("../../../models/CommentLikes")

async function deleteCommentLikes({ postId, postUserId, commentId }) {
  const filter = { status: { $ne: "deleted" } }

  if (postUserId) filter.postUserId = postUserId
  if (postId) filter.postId = postId
  if (commentId) filter.commentId = commentId

  const res = await CommentLikes.updateMany(filter, {
    $set: {
      status: "deleted",
      deletedAt: new Date(),
    },
  })

  return res.modifiedCount
}

module.exports = deleteCommentLikes
