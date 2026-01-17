const BanHistory = require("../../../models/BanHistory")

async function hardDeleteBanHistory(entity_id) {
  const res = await BanHistory.deleteMany({ entity_id })
  return res.deletedCount || 0
}

module.exports = hardDeleteBanHistory
