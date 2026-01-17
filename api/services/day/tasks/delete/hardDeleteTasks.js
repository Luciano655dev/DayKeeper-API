const DayTask = require("../../../../models/DayTask")

async function hardDeleteDayTasks(userId) {
  const res = await DayTask.deleteMany({ user: userId })
  return res.deletedCount || 0
}

module.exports = hardDeleteDayTasks
