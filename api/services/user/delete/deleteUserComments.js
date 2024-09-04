const PostComments = require("../../../models/PostComments")

const deleteUserComments = async (loggedUserId) => {
  try {
    const response = await PostComments.deleteMany({ userId: loggedUserId })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteUserComments
