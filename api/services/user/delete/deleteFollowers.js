const Followers = require("../../../models/Followers")

const deleteFollowers = async (loggedUserId) => {
  try {
    const res = await Followers.updateMany(
      {
        $or: [{ followerId: loggedUserId }, { followingId: loggedUserId }],
        status: { $ne: "deleted" },
      },
      {
        $set: { status: "deleted", deletedAt: new Date() },
      }
    )

    return res.modifiedCount ?? res.nModified ?? 0
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteFollowers
