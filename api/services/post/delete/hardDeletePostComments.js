const PostComments = require("../../../models/PostComments")

async function hardDeletePostComments({ postId, postUserId }) {
  const res = await PostComments.deleteMany({ postId, postUserId })
  return res.deletedCount || 0
}

module.exports = hardDeletePostComments
