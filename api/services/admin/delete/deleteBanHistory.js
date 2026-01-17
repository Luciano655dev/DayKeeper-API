const BanHistory = require("../../../models/BanHistory")

const deleteBanHistory = async (entity_id) => {
  try {
    const res = await BanHistory.updateMany(
      {
        entity_id,
        status: { $ne: "deleted" },
      },
      {
        $set: {
          status: "deleted",
          deletedAt: new Date(),
        },
      }
    )

    return res.modifiedCount
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteBanHistory
