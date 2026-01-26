const noteInfoPipeline = require("../../common/day/notes/noteInfoPipeline")

function escapeRegex(input = "") {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const searchNotePipeline = (searchQuery, filterPipe, mainUser) => {
  const q = (searchQuery || "").trim().slice(0, 64)
  const safe = escapeRegex(q)
  const regex = safe ? new RegExp(safe, "i") : null

  return [
    {
      $match: {
        ...(filterPipe && Object.keys(filterPipe).length ? filterPipe : {}),
        ...(regex ? { text: { $regex: regex } } : {}),
      },
    },

    { $sort: { date: -1, _id: -1 } },
    ...noteInfoPipeline(mainUser),
  ]
}

module.exports = searchNotePipeline
