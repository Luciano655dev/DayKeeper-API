const Post = require("../../../models/Post")

async function hardDeleteCommentsLikes(userId) {
  const res = await Post.updateMany(
    {},
    { $pull: { "comments.$[].likes": userId } }
  )
  return res.modifiedCount ?? res.nModified ?? 0
}

module.exports = hardDeleteCommentsLikes
