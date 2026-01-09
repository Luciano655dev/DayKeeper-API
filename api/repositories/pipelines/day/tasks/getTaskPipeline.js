const taskInfoPipeline = require("../../../common/day/tasks/taskInfoPipeline")
const mongoose = require("mongoose")

const getTaskPipeline = (taskId, mainUser) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(taskId),
    },
  },
  ...taskInfoPipeline(mainUser),
]

module.exports = getTaskPipeline
