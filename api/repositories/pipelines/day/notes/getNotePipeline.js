const noteInfoPipeline = require("../../../common/day/notes/noteInfoPipeline")
const mongoose = require("mongoose")

const getNotePipeline = (noteId, mainUser) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(noteId),
    },
  },
  ...noteInfoPipeline(mainUser),
]

module.exports = getNotePipeline
