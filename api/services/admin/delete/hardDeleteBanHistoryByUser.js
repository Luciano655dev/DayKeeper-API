const BanHistory = require("../../../models/BanHistory")

async function hardDeleteBanHistoryByUser(userId) {
  const res = await BanHistory.deleteMany({ entity_id: String(userId) })
  return res.deletedCount || 0
}

module.exports = hardDeleteBanHistoryByUser
