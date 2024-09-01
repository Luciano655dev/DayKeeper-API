const User = require("../../../models/User")
const Post = require("../../../models/Post")

const {
  errors: { notFound },
  success: { deleted },
} = require("../../../../constants/index")

const deleteUserReport = async (props) => {
  const { name: username, title, reportId } = props

  try {
    const postUser = await User.findOne({ name: username })
    if (!postUser) return notFound(`User`)

    const updatedPost = await Post.findOneAndUpdate(
      { user: postUser._id, title: title },
      {
        $pull: {
          reports: { _id: reportId },
        },
      },
      { new: true }
    )
    if (!updatedPost) return notFound("Post")

    return deleted(`Report`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteUserReport
