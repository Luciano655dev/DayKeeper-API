const mongoose = require("mongoose")
const PostComments = require("../../models/PostComments")
const commentPost = require("./commentPost")
const {
  errors: { invalidValue, notFound },
} = require("../../../constants/index")

const commentOnComment = async (props) => {
  const { commentId, loggedUser, comment, gif } = props

  if (!mongoose.Types.ObjectId.isValid(commentId))
    return invalidValue("Comment ID")

  const parent = await PostComments.findOne({
    _id: commentId,
    status: { $ne: "deleted" },
  })
  if (!parent) return notFound("Comment")

  return commentPost({
    postId: parent.postId,
    parentCommentId: parent._id,
    loggedUser,
    comment,
    gif,
  })
}

module.exports = commentOnComment
