const User = require("../../../models/User")

async function hardDeleteUser(userId) {
  const res = await User.deleteOne({ _id: userId })
  return res.deletedCount || 0
}

module.exports = hardDeleteUser
