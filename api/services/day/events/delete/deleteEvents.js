const DayEvent = require("../../../../models/DayEvent")

const deleteEvent = async (entityId) => {
  try {
    const res = await DayEvent.updateOne(
      {
        $and: [
          { $or: [{ _id: entityId }, { user: entityId }] },
          { status: { $ne: "deleted" } },
        ],
      },
      {
        $set: {
          status: "deleted",
          deletedAt: new Date(),
        },
      }
    )

    if ((res.matchedCount ?? res.n ?? 0) === 0) return 0
    return res.modifiedCount ?? res.nModified ?? 1
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = deleteEvent
