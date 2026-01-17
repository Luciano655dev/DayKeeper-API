const cron = require("node-cron")
const DayEvent = require("../../models/DayEvent")

const {
  delete: { dayRetentionDays: EVENT_RETENTION_DAYS },
} = require("../../../constants/index")

const BATCH_SIZE = Number(process.env.EVENT_PURGE_BATCH || 200)

const hardDeleteSoftDeletedEvents = async () => {
  try {
    const cutoff = new Date(
      Date.now() - EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000
    )

    const res = await DayEvent.deleteMany({
      status: "deleted",
      deletedAt: { $ne: null, $lt: cutoff },
    }).maxTimeMS(30000)

    const deletedCount = res.deletedCount || 0
    if (deletedCount) console.log("PURGED DayEvents:", deletedCount)
  } catch (err) {
    console.error("hardDeleteSoftDeletedDayEvents failed:", err)
  }
}

// Every day at 02:10
cron.schedule("10 2 * * *", hardDeleteSoftDeletedEvents)

module.exports = hardDeleteSoftDeletedEvents
