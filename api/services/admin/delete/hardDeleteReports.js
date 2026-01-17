const Report = require("../../../models/Report")

async function hardDeleteReports(referenceId) {
  const res = await Report.deleteMany({ referenceId })
  return res.deletedCount || 0
}

module.exports = hardDeleteReports
