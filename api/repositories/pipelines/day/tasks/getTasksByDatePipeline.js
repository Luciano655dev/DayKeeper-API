const mongoose = require("mongoose")
const taskInfoPipeline = require("../../../common/day/tasks/taskInfoPipeline")

const getUserTasksByDayPipeline = ({ mainUser, targetUserId, start, end }) => {
  return [
    {
      $match: {
        user: new mongoose.Types.ObjectId(targetUserId),
        date: { $gte: start, $lt: end },
      },
    },

    ...taskInfoPipeline(mainUser),

    { $sort: { date: -1, _id: -1 } },
  ]
}

module.exports = getUserTasksByDayPipeline
