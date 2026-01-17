const PostComments = require("../../../models/PostComments")

async function hardDeleteUserComments(userId) {
  const res = await PostComments.deleteMany({ userId: String(userId) })
  return res.deletedCount || 0
}

module.exports = hardDeleteUserComments
