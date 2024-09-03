const mongoose = require("mongoose")

const blocksSchema = mongoose.Schema({
  blockId: {
    // user that blocked someone
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  blockedId: {
    // user that have been blocked by someone
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const Blocks = mongoose.model("Blocks", blocksSchema, "blocks")

module.exports = Blocks
