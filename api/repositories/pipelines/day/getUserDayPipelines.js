const mongoose = require("mongoose")

const userInfoPipeline = require("../../common/userInfoPipeline")
const taskInfoPipeline = require("../../common/day/tasks/taskInfoPipeline")
const noteInfoPipeline = require("../../common/day/notes/noteInfoPipeline")
const eventInfoPipeline = require("../../common/day/events/eventInfoPipeline")

function buildDayMatchStage(tz, dateStr, opts = {}) {
  const {
    singleField = "date",
    rangeStartField = "dateStart",
    rangeEndField = "dateEnd",
  } = opts

  // parse dateStr (DD-MM-YYYY) but fallback to $$NOW if invalid/null
  const baseDateExpr = dateStr
    ? {
        $ifNull: [
          {
            $dateFromString: {
              dateString: dateStr,
              format: "%d-%m-%Y",
              timezone: tz,
              onError: null,
              onNull: null,
            },
          },
          "$$NOW",
        ],
      }
    : "$$NOW"

  const dayStart = {
    $dateTrunc: { date: baseDateExpr, unit: "day", timezone: tz },
  }

  const dayEnd = {
    $dateAdd: { startDate: dayStart, unit: "day", amount: 1 },
  }

  // If doc has dateStart (range schema): overlap match
  // overlap condition: start < dayEnd AND (end or start) >= dayStart
  // If doc has date (single schema): date in [dayStart, dayEnd)
  return {
    $match: {
      $expr: {
        $or: [
          // single timestamp docs (date)
          {
            $and: [
              { $ne: [`$${singleField}`, null] },
              { $gte: [`$${singleField}`, dayStart] },
              { $lt: [`$${singleField}`, dayEnd] },
            ],
          },

          // range docs (dateStart/dateEnd)
          {
            $and: [
              { $ne: [`$${rangeStartField}`, null] },
              { $lt: [`$${rangeStartField}`, dayEnd] },
              {
                $gte: [
                  { $ifNull: [`$${rangeEndField}`, `$${rangeStartField}`] },
                  dayStart,
                ],
              },
            ],
          },
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
    buildDayMatchStage(tz, dateStr, {
      singleField: "date",
      rangeStartField: "dateStart",
      rangeEndField: "dateEnd",
    }),
    ...taskInfoPipeline(loggedUser),
    { $sort: { date: -1, _id: -1 } },
  ]
}

function getUserDayNotesAggPipeline({ targetUserId, loggedUser, tz, dateStr }) {
  return [
    { $match: { user: new mongoose.Types.ObjectId(targetUserId) } },
    buildDayMatchStage(tz, dateStr, {
      singleField: "date",
    }),
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
    buildDayMatchStage(tz, dateStr, {
      singleField: "date",
    }),
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
