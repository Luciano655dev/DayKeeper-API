const Post = require("../../models/Post")
const PostLikes = require("../../models/PostLikes")
const deleteFile = require("../../utils/deleteFile")
const {
  errors: { notFound },
  success: { deleted },
} = require("../../../constants/index")

const deletePost = async (props) => {
  const { title, loggedUser } = props

  try {
    const deletedPost = await Post.findOneAndDelete({
      title: title,
      user: loggedUser._id,
    })

    if (!deletedPost) return notFound("Post")

    // delete likes
    await PostLikes.deleteMany({ postId: deletedPost._id })

    // delete files
    for (let i in deletedPost.files) deleteFile(deletedPost.files[i].key)

    return deleted(`Post`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deletePost
