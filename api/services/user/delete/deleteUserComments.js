const PostComments = require("../../../models/PostComments")

const deleteUserComments = async (loggedUserId) => {
  try {
    const res = await PostComments.updateMany(
      { userId: loggedUserId, status: { $ne: "deleted" } },
      { $set: { status: "deleted", deletedAt: new Date() } }
    )

    return res.modifiedCount ?? res.nModified ?? 0
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteUserComments
