const taskInfoPipeline = require("../../../common/day/tasks/taskInfoPipeline")

const getTaskPipeline = (targetUser, loggedUser) => [
  {
    $match: {
      user: targetUser._id,
      daily: true,
    },
  },
  ...taskInfoPipeline(loggedUser),
  { $sort: { createdAt: -1 } },
]

module.exports = getTaskPipeline
