const taskInfoPipeline = require("../../../common/day/tasks/taskInfoPipeline")
const mongoose = require("mongoose")

const getTaskPipeline = (noteId, mainUser) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(noteId),
    },
  },
  ...taskInfoPipeline(mainUser),
]

module.exports = getTaskPipeline
