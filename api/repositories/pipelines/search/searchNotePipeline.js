const mongoose = require("mongoose")
const noteInfoPipeline = require("../../common/day/notes/noteInfoPipeline")

function escapeRegex(input = "") {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const searchNotePipeline = (searchQuery, filterPipe, user, mainUser) => {
  const q = (searchQuery || "").trim().slice(0, 64)
  const safe = escapeRegex(q)
  const regex = safe ? new RegExp(safe, "i") : null

  const userId = new mongoose.Types.ObjectId(user._id)

  return [
    {
      $match: {
        user: userId,
        ...(filterPipe && Object.keys(filterPipe).length ? filterPipe : {}),
        ...(regex ? { text: { $regex: regex } } : {}),
      },
    },

    { $sort: { date: -1, _id: -1 } },
    ...noteInfoPipeline(mainUser),
  ]
}

module.exports = searchNotePipeline
