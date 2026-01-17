const Post = require("../../../models/Post")

async function hardDeletePosts(userId) {
  const res = await Post.deleteMany({ user: userId })
  return res.deletedCount || 0
}

module.exports = hardDeletePosts
