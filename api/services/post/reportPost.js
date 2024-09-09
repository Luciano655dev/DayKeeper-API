const findPost = require("./get/findPost")
const Report = require("../../models/Report")
const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction },
  success: { custom },
} = require("../../../constants/index")

const reportPost = async (props) => {
  const { name: username, title, reason, loggedUser } = props

  if (reason.length > maxReportReasonLength) return inputTooLong("Reason")

  try {
    const post = await findPost({
      userInput: username,
      title: title,
      type: "username",
    })
    if (!post) return notFound("Post")

    const reportRelation = await Report.exists({
      referenceId: post._id,
      userId: loggedUser._id,
      type: "post",
    })
    if (reportRelation) return doubleAction()

    await Report.create({
      referenceId: post._id,
      userId: loggedUser._id,
      reason,
      created_at: new Date(),
      type: "post",
    })

    return custom("Post reported successfully", { reason })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reportPost
