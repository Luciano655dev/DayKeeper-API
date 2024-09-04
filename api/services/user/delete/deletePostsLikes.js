const PostLikes = require("../../../models/PostLikes")

const deletePostsLikes = async (loggedUserId) => {
  try {
    const response = await PostLikes.deleteMany({ userId: loggedUserId })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePostsLikes
