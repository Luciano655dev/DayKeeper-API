const User = require("../../models/User")

module.exports = async function getUserData({ userId }) {
  const user = await User.findById(userId).select(
    "_id username email profile_picture roles verified_email timeZone private"
  )

  if (!user) {
    return { code: 404, message: "User not found", user: null }
  }

  return { code: 200, message: "User data", user }
}
