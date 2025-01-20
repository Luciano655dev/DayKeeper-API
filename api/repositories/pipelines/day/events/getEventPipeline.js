const eventInfoPipeline = require("../../../common/day/events/eventInfoPipeline")
const mongoose = require("mongoose")

const getEventPipeline = (eventId, mainUser) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(eventId),
    },
  },
  ...eventInfoPipeline(mainUser),
]

module.exports = getEventPipeline
