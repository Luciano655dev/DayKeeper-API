const findUser = require("./get/findUser")
const Report = require("../../models/Report")
const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction },
  success: { custom },
} = require("../../../constants/index")

const reportUser = async (props) => {
  const { name, reason, loggedUser } = props

  if (reason.length > maxReportReasonLength) return inputTooLong("Reason")

  try {
    const user = await findUser({ userInput: name })
    if (!user) return notFound("User")

    const reportRelation = await Report.exists({
      referenceId: user._id,
      reportedUserId: user._id,
      userId: loggedUser._id,
      type: "user",
    })
    if (reportRelation) return doubleAction()

    /* Send Report */
    await Report.create({
      referenceId: user._id,
      userId: loggedUser._id,
      reason,
      created_at: new Date(),
      type: "user",
    })

    return custom(`${name} Reported Successfully`, {
      reason,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reportUser
