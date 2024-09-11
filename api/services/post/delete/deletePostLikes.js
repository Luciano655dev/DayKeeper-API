const PostLikes = require("../../../models/PostLikes")

const deletePostLikes = async (id) => {
  try {
    const response = await PostLikes.deleteMany({
      $and: [{ postId: id }, { postUserId: id }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePostLikes
