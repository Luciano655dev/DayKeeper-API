const mongoose = require("mongoose")

const storieLikesSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  storieUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  storieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Storie",
  },
})

const StorieLikes = mongoose.model(
  "StorieLikes",
  storieLikesSchema,
  "storieLikes"
)

module.exports = StorieLikes
