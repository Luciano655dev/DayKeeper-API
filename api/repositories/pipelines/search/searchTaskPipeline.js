const mongoose = require("mongoose")
const taskInfoPipeline = require("../../common/day/tasks/taskInfoPipeline")

function escapeRegex(input = "") {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const searchTaskPipeline = (searchQuery, filterPipe, user, mainUser) => {
  const q = (searchQuery || "").trim().slice(0, 64)
  const safe = escapeRegex(q)
  const regex = safe ? new RegExp(safe, "i") : null

  const userId = new mongoose.Types.ObjectId(user._id)

  return [
    {
      $match: {
        user: userId,
        ...(filterPipe && Object.keys(filterPipe).length ? filterPipe : {}),
        ...(regex ? { title: { $regex: regex } } : {}),
        daily: { $ne: true },
      },
    },

    { $sort: { date: -1, _id: -1 } },

    ...taskInfoPipeline(mainUser),
  ]
}

module.exports = searchTaskPipeline
