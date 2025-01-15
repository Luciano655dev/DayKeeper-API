const Post = require("../../models/Post")
const deleteFile = require("../../utils/deleteFile")
const deletePostLikes = require("./delete/deletePostLikes")
const deletePostComments = require("./delete/deletePostComments")
const deleteCommentLikes = require("./delete/deleteCommentLikes")
const deleteReports = require("../delete/deleteReports")
const deleteBanHistory = require("../delete/deleteBanHistory")
const {
  errors: { notFound },
  success: { deleted },
} = require("../../../constants/index")

const deletePost = async (props) => {
  const { postId, loggedUser } = props

  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      user: loggedUser._id,
    })

    if (!deletedPost) return notFound("Post")

    // delete Post Stuff
    await deletePostLikes(deletedPost._id)
    await deletePostComments(deletedPost._id)
    await deleteCommentLikes(deletedPost._id)

    await deleteReports(deletedPost._id)
    await deleteBanHistory(deletedPost._id)

    // delete files
    for (let i in deletedPost?.files) deleteFile(deletedPost.files[i].key)

    return deleted(`Post`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePost
