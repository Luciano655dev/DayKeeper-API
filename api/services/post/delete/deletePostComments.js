const PostComments = require("../../../models/PostComments")

async function deletePostComments({ postId, postUserId }) {
  const res = await PostComments.updateMany(
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

module.exports = deletePostComments
