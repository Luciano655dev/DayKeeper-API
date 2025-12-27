const Report = require("../../../models/Report")

const deleteReports = async (referenceId) => {
  try {
    const response = await Report.deleteMany({ referenceId })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteReports
