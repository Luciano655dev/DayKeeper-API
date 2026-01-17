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

  status: {
    type: String,
    enum: ["pending", "public", "rejected", "deleted"],
    default: "public",
    index: true,
  },
  deletedAt: { type: Date, default: null, required: false },
})

// indexes
blocksSchema.index({ blockId: 1, blockedId: 1 }, { unique: true })

const Blocks = mongoose.model("Blocks", blocksSchema, "blocks")

module.exports = Blocks
