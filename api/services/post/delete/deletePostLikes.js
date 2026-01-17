const PostLikes = require("../../../models/PostLikes")

async function deletePostLikes({ postId, postUserId }) {
  const res = await PostLikes.updateMany(
    {
      postId,
      postUserId,
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

module.exports = deletePostLikes
