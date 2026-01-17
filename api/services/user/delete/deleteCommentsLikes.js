const CommentLikes = require("../../../models/CommentLikes")

const deleteCommentsLikes = async (loggedUserId) => {
  try {
    const res = await CommentLikes.updateMany(
      {
        userId: loggedUserId,
        status: { $ne: "deleted" },
      },
      {
        $set: {
          status: "deleted",
          deletedAt: new Date(),
        },
      }
    )

    return res.modifiedCount ?? res.nModified ?? 0
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteCommentsLikes
