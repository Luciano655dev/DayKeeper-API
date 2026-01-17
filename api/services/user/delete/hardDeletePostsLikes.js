const PostLikes = require("../../../models/PostLikes")

async function hardDeletePostsLikes(userId) {
  const res = await PostLikes.deleteMany({ userId: String(userId) })
  return res.deletedCount || 0
}

module.exports = hardDeletePostsLikes
