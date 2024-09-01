const Followers = require("../../../models/Followers")

const deleteFollowers = async (loggedUserId) => {
  try {
    const response = await Followers.deleteMany({
      $or: [{ followerId: loggedUserId }, { followingId: loggedUserId }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteFollowers
