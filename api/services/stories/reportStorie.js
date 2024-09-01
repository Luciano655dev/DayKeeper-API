const Storie = require("../../models/Storie")
const mongoose = require(`mongoose`)
const { hideGeneralData, hideStorieData } = require(`../../repositories`)

const {
  user: { maxReportReasonLength },
  errors: { inputTooLong, notFound, doubleAction, invalidValue },
  success: { custom },
} = require("../../../constants/index")

const reportPost = async (props) => {
  const { title, reason, loggedUser } = props

  if (reason.length > maxReportReasonLength) return inputTooLong("Reason")

  try {
    if (!mongoose.Types.ObjectId.isValid(title))
      return invalidValue(`Storie ID`)

    const reportedStorie = await Storie.findById(title)
    if (!reportedStorie) return notFound("Storie")

    if (reportedStorie.reports.find((report) => report.user == loggedUser._id))
      return doubleAction()

    const updatedStorie = await Storie.findByIdAndUpdate(
      title,
      {
        $addToSet: {
          reports: {
            user: loggedUser._id,
            created_at: new Date(),
            reason,
          },
        },
      },
      { projection: { ...hideGeneralData, ...hideStorieData } }
    )

    return custom("Storie reported successfully", { storie: updatedStorie })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = reportPost
