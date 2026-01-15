const mongoose = require("mongoose")
const eventInfoPipeline = require("../../../common/day/events/eventInfoPipeline")

const getEventByDatePipeline = ({ mainUser, targetUserId, start, end }) => {
  return [
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$user", new mongoose.Types.ObjectId(targetUserId)] },

            // overlap condition:
            // eventStart < dayEnd AND eventEnd > dayStart
            { $lt: ["$dateStart", end] },
            { $gt: ["$dateEnd", start] },
          ],
        },
      },
    },

    ...eventInfoPipeline(mainUser),

    // keep consistent naming (your Event model might be created_at)
    { $sort: { dateStart: -1, _id: -1 } },
  ]
}

module.exports = getEventByDatePipeline
