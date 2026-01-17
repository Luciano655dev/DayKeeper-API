const Report = require("../../../models/Report")

const deleteReports = async (referenceId) => {
  try {
    const res = await Report.updateMany(
      {
        referenceId,
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

module.exports = deleteReports
