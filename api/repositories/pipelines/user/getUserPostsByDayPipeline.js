const mongoose = require("mongoose")
const postInfoPipeline = require("../../common/postInfoPipeline")

const userPostsByDayPipeline = ({ mainUser, targetUserId, start, end }) => {
  return [
    {
      $match: {
        user: new mongoose.Types.ObjectId(targetUserId),
        created_at: { $gte: start, $lt: end },
      },
    },

    ...postInfoPipeline(mainUser),

    { $sort: { createdAt: -1, _id: -1 } },
  ]
}

module.exports = userPostsByDayPipeline
