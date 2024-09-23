const mongoose = require("mongoose")

const elementBanHistoryPipeline = (elementId) => [
  {
    $match: {
      entity_id: new mongoose.Types.ObjectId(elementId),
    },
  },
]

module.exports = elementBanHistoryPipeline
