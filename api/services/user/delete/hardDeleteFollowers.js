const Followers = require("../../../models/Followers")

async function hardDeleteFollowers(userId) {
  const res = await Followers.deleteMany({
    $or: [{ followerId: userId }, { followingId: userId }],
  })
  return res.deletedCount || 0
}

module.exports = hardDeleteFollowers
