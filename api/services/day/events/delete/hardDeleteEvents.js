const DayEvent = require("../../../../models/DayEvent")

async function hardDeleteDayEvents(userId) {
  const res = await DayEvent.deleteMany({ user: userId })
  return res.deletedCount || 0
}

module.exports = hardDeleteDayEvents
