const getPost = require("./getPost")
const Report = require("../../models/Report")
const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction },
  success: { custom },
} = require("../../../constants/index")

const reportPost = async (props) => {
  const { postId, reason, loggedUser } = props

  if (reason.length > maxReportReasonLength) return inputTooLong("Reason")

  try {
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    /* Create Report Relation */
    const reportRelation = await Report.exists({
      referenceId: post._id,
      userId: loggedUser._id,
    })
    if (reportRelation) return doubleAction()

    await Report.create({
      referenceId: post._id,
      userId: loggedUser._id,
      reportedUserId: post.user,
      reason,
      created_at: new Date(),
      type: "post",
    })

    console.log("here")
    return custom("Post reported successfully", 200, { reason })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reportPost
