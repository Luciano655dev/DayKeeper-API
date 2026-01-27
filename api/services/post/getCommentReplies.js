const mongoose = require("mongoose")
const PostComments = require("../../models/PostComments")
const getPost = require("./getPost")
const getDataWithPages = require("../getDataWithPages")
const { getPostCommentsPipeline } = require("../../repositories/index")
const {
  errors: { invalidValue, notFound },
  success: { fetched },
} = require("../../../constants/index")

const getCommentReplies = async (props) => {
  const { commentId, loggedUser, page, maxPageSize } = props

  if (!mongoose.Types.ObjectId.isValid(commentId))
    return invalidValue("Comment ID")

  const parent = await PostComments.findOne({
    _id: commentId,
    status: { $ne: "deleted" },
  })
  if (!parent) return notFound("Comment")

  const postResponse = await getPost({ postId: parent.postId, loggedUser })
  if (postResponse.code !== 200) return notFound("Post")

  const replies = await getDataWithPages({
    pipeline: getPostCommentsPipeline({
      postId: parent.postId,
      parentCommentId: commentId,
      mainUser: loggedUser,
    }),
    type: "PostComments",
    page,
    maxPageSize,
  })

  return fetched("Comment Replies", {
    response: {
      commentId,
      ...replies,
    },
  })
}

module.exports = getCommentReplies
