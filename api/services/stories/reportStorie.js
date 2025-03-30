const Storie = require("../../models/Storie")
const Report = require("../../models/Report")
const mongoose = require(`mongoose`)
const { hideGeneralData, hideStorieData } = require(`../../repositories`)

const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction, invalidValue },
  success: { custom },
} = require("../../../constants/index")

const reportPost = async (props) => {
  const { storieId, reason, loggedUser } = props

  if (reason.length > maxReportReasonLength) return inputTooLong("Reason")

  try {
    if (!mongoose.Types.ObjectId.isValid(storieId))
      return invalidValue(`Storie ID`)

    const storie = await Storie.findById(storieId)
    if (!storie) return notFound("Storie")

    const reportRelation = await Report.exists({
      referenceId: storie._id,
      userId: loggedUser._id,
      type: "storie",
    })
    if (reportRelation) return doubleAction()

    await Report.create({
      referenceId: storie._id,
      userId: loggedUser._id,
      reason,
      created_at: new Date(),
      type: "storie",
    })

    return custom("Storie reported successfully", 200, { storie })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reportPost
