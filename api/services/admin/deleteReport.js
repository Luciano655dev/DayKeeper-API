const Report = require("../../models/Report")
const {
  errors: { notFound },
  success: { deleted },
} = require("../../../constants/index")

const deleteReport = async (props) => {
  const { reportId } = props

  try {
    const reportRelation = await Report.findById(reportId)
    if (!reportRelation) return notFound("Report")

    await Report.deleteOne({ _id: reportId })

    return deleted(`Report`)
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteReport
