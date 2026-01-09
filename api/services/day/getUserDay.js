const mongoose = require("mongoose")
const User = require("../../models/User")

const DayTask = require("../../models/DayTask")
const DayNote = require("../../models/DayNote")
const DayEvent = require("../../models/DayEvent")

const {
  getUserInfoAggPipeline,
  getUserDayTasksAggPipeline,
  getUserDayNotesAggPipeline,
  getUserDayEventsAggPipeline,
} = require("../../repositories/pipelines/day/getUserDayPipelines")

const {
  user: { defaultTimeZone },
  errors: { notFound, invalidValue },
  success: { fetched },
} = require("../../../constants/index")

const getUserDay = async (props) => {
  const { name, dateStr, loggedUser } = props || {}

  const cleanDateStr =
    typeof dateStr === "string" && /^\d{2}-\d{2}-\d{4}$/.test(dateStr)
      ? dateStr
      : dateStr
      ? null
      : null

  if (dateStr && !cleanDateStr) {
    return invalidValue("Date must be DD-MM-YYYY")
  }

  const targetUser = await User.findOne({ name }).select("_id name")
  if (!targetUser) return notFound("User")

  const tz = loggedUser?.timeZone || defaultTimeZone
  const targetUserId = new mongoose.Types.ObjectId(targetUser._id)

  const userAgg = await User.aggregate(
    getUserInfoAggPipeline({ targetUserId, loggedUser })
  )
  const userInfo = userAgg?.[0] || null
  if (!userInfo) return notFound("User")

  const tasksPromise = DayTask.aggregate(
    getUserDayTasksAggPipeline({
      targetUserId,
      loggedUser,
      tz,
      dateStr: cleanDateStr,
    })
  )

  const notesPromise = DayNote.aggregate(
    getUserDayNotesAggPipeline({
      targetUserId,
      loggedUser,
      tz,
      dateStr: cleanDateStr,
    })
  )

  const eventsPromise = DayEvent.aggregate(
    getUserDayEventsAggPipeline({
      targetUserId,
      loggedUser,
      tz,
      dateStr: cleanDateStr,
    })
  )

  const [tasks, notes, events] = await Promise.all([
    tasksPromise,
    notesPromise,
    eventsPromise,
  ])

  return fetched("day", {
    data: {
      user: userInfo,
      date: cleanDateStr || "today",
      timeZone: tz,
      stats: {
        notesCount: notes.length,
        tasksCount: tasks.length,
        eventsCount: events.length,
      },
      tasks,
      notes,
      events,
    },
  })
}

module.exports = getUserDay
