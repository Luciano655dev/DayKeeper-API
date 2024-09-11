const mongoose = require("mongoose")

const StorieViewsSchema = mongoose.Schema({
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

const StorieViews = mongoose.model(
  "StorieViews",
  StorieViewsSchema,
  "storieViews"
)

module.exports = StorieViews
