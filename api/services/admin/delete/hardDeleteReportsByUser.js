const Report = require("../../../models/Report")

async function hardDeleteReportsByUser(userId) {
  const res = await Report.deleteMany({ referenceId: String(userId) })
  return res.deletedCount || 0
}

module.exports = hardDeleteReportsByUser
