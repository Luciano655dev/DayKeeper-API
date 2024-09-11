const PostComments = require("../../../models/PostComments")

const deletePostComments = async (id) => {
  try {
    const response = await PostComments.deleteMany({
      $and: [{ postId: id }, { postUserId: id }],
    })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePostComments
