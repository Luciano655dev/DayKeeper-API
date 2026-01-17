const Post = require("../../../models/Post")

const deletePosts = async (loggedUserId) => {
  try {
    const res = await Post.updateMany(
      { user: loggedUserId, status: { $ne: "deleted" } },
      { $set: { status: "deleted", deletedAt: new Date() } }
    )

    return res.modifiedCount ?? res.nModified ?? 0
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePosts
