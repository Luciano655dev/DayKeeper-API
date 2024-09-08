const mongoose = require("mongoose")

const StorieViewsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  storieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const StorieViews = mongoose.model(
  "StorieViews",
  StorieViewsSchema,
  "storieViews"
)

module.exports = StorieViews
