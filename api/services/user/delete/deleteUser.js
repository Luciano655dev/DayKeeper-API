const User = require("../../../models/User")

const deleteUser = async (loggedUserId) => {
  try {
    const res = await User.findByIdAndUpdate(
      loggedUserId,
      { $set: { status: "deleted", deletedAt: new Date() } },
      { new: true }
    )

    return res
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteUser
