const DayNote = require("../../../../models/DayNote")

async function hardDeleteDayNotes(userId) {
  const res = await DayNote.deleteMany({ user: userId })
  return res.deletedCount || 0
}

module.exports = hardDeleteDayNotes
