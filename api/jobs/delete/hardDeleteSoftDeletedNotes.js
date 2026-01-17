const cron = require("node-cron")
const DayNote = require("../../models/DayNote")

const {
  delete: { dayRetentionDays: NOTE_RETENTION_DAYS },
} = require("../../../constants/index")

const hardDeleteSoftDeletedDayNotes = async () => {
  try {
    const cutoff = new Date(
      Date.now() - NOTE_RETENTION_DAYS * 24 * 60 * 60 * 1000
    )

    const res = await DayNote.deleteMany({
      status: "deleted",
      deletedAt: { $ne: null, $lt: cutoff },
    }).maxTimeMS(30000)

    const deletedCount = res.deletedCount || 0
    if (deletedCount) console.log("PURGED DayNotes:", deletedCount)
  } catch (err) {
    console.error("hardDeleteSoftDeletedDayNotes failed:", err)
  }
}

// Every day at 02:20
cron.schedule("20 2 * * *", hardDeleteSoftDeletedDayNotes)

module.exports = hardDeleteSoftDeletedDayNotes
