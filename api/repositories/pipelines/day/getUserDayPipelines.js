const mongoose = require("mongoose")

const userInfoPipeline = require("../../common/userInfoPipeline")
const taskInfoPipeline = require("../../common/day/tasks/taskInfoPipeline")
const noteInfoPipeline = require("../../common/day/notes/noteInfoPipeline")
const eventInfoPipeline = require("../../common/day/events/eventInfoPipeline")

function buildDayMatchStage(fieldName, tz, dateStr) {
  const dayStartExpr = dateStr
    ? {
        $dateTrunc: {
          date: {
            $dateFromString: {
              dateString: dateStr, // DD-MM-YYYY
              format: "%d-%m-%Y",
              timezone: tz,
              onError: null,
              onNull: null,
            },
          },
          unit: "day",
          timezone: tz,
        },
      }
    : { $dateTrunc: { date: "$$NOW", unit: "day", timezone: tz } }

  return {
    $match: {
      $expr: {
        $eq: [
          { $dateTrunc: { date: `$${fieldName}`, unit: "day", timezone: tz } },
          dayStartExpr,
        ],
      },
    },
  }
}

function getUserInfoAggPipeline({ targetUserId, loggedUser }) {
  return [
    { $match: { _id: new mongoose.Types.ObjectId(targetUserId) } },
    ...userInfoPipeline(loggedUser),
  ]
}

function getUserDayTasksAggPipeline({ targetUserId, loggedUser, tz, dateStr }) {
  return [
    { $match: { user: new mongoose.Types.ObjectId(targetUserId) } },
    buildDayMatchStage("date", tz, dateStr),
    ...taskInfoPipeline(loggedUser),
    { $sort: { date: -1, _id: -1 } },
  ]
}

function getUserDayNotesAggPipeline({ targetUserId, loggedUser, tz, dateStr }) {
  return [
    { $match: { user: new mongoose.Types.ObjectId(targetUserId) } },
    buildDayMatchStage("date", tz, dateStr),
    ...noteInfoPipeline(loggedUser),
    { $sort: { date: -1, _id: -1 } },
  ]
}

function getUserDayEventsAggPipeline({
  targetUserId,
  loggedUser,
  tz,
  dateStr,
}) {
  return [
    { $match: { user: new mongoose.Types.ObjectId(targetUserId) } },
    buildDayMatchStage("dateStart", tz, dateStr),
    ...eventInfoPipeline(loggedUser),
    { $sort: { dateStart: -1, _id: -1 } },
  ]
}

module.exports = {
  getUserInfoAggPipeline,
  getUserDayTasksAggPipeline,
  getUserDayNotesAggPipeline,
  getUserDayEventsAggPipeline,
}
