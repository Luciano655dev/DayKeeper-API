const Report = require("../../models/Report")
const mongoose = require("mongoose")
const {
  errors: { notFound },
  success: { deleted },
} = require("../../../constants/index")

const deleteReport = async (props) => {
  const { reportId } = props

  try {
    if (!mongoose.Types.ObjectId.isValid(reportId))
      return resizeBy.status(400).json({ message: "Invalid ID" })

    const reportRelation = await Report.findById(reportId)
    if (!reportRelation) return notFound("Report")

    await Report.deleteOne({ _id: reportId })

    return deleted(`Report`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteReport
