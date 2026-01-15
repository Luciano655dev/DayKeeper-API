const mongoose = require("mongoose")
const noteInfoPipeline = require("../../../common/day/notes/noteInfoPipeline")

const getNotesByDatePipeline = ({ mainUser, targetUserId, start, end }) => {
  return [
    {
      $match: {
        user: new mongoose.Types.ObjectId(targetUserId),
        date: { $gte: start, $lt: end },
      },
    },

    ...noteInfoPipeline(mainUser),

    // keep consistent naming (your Event model might be created_at)
    { $sort: { dateStart: -1, _id: -1 } },
  ]
}

module.exports = getNotesByDatePipeline
