const cron = require("node-cron")
const DayTask = require("../../models/DayTask")

const {
  delete: { dayRetentionDays: TASK_RETENTION_DAYS },
} = require("../../../constants/index")

const hardDeleteSoftDeletedDayTasks = async () => {
  try {
    const cutoff = new Date(
      Date.now() - TASK_RETENTION_DAYS * 24 * 60 * 60 * 1000
    )

    const res = await DayTask.deleteMany({
      status: "deleted",
      deletedAt: { $ne: null, $lt: cutoff },
    }).maxTimeMS(30000)

    const deletedCount = res.deletedCount || 0
    if (deletedCount) console.log("PURGED DayTasks:", deletedCount)
  } catch (err) {
    console.error("hardDeleteSoftDeletedDayTasks failed:", err)
  }
}

// Every day at 02:30
cron.schedule("30 2 * * *", hardDeleteSoftDeletedDayTasks)

module.exports = hardDeleteSoftDeletedDayTasks
