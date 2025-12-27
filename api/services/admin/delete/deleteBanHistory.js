const BanHistory = require("../../../models/BanHistory")

const deleteBanHistory = async (entity_id) => {
  try {
    const response = await BanHistory.deleteMany({ entity_id })

    return response.nModified
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteBanHistory
