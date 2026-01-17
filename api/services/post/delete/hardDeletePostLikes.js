const PostLikes = require("../../../models/PostLikes")

async function hardDeletePostLikes({ postId, postUserId }) {
  const res = await PostLikes.deleteMany({ postId, postUserId })
  return res.deletedCount || 0
}

module.exports = hardDeletePostLikes
