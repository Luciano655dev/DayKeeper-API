const CommentLikes = require("../../../models/CommentLikes")

async function deleteCommentLikes({ postId, postUserId }) {
  const res = await CommentLikes.updateMany(
    {
      postUserId,
      $or: [{ postId }, { commentId: postId }],
      status: { $ne: "deleted" },
    },
    {
      $set: {
        status: "deleted",
        deletedAt: new Date(),
      },
    }
  )

  return res.modifiedCount
}

module.exports = deleteCommentLikes
