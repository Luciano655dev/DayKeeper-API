const noteInfoPipeline = require("../../common/day/notes/noteInfoPipeline")
const mongoose = require("mongoose")

const searchNotePipeline = (searchQuery, filterPipe, user, mainUser) => [
  ...noteInfoPipeline(mainUser),
  {
    $match: {
      $and: [
        { "user_info._id": new mongoose.Types.ObjectId(user._id) },

        filterPipe,
      ],

      // search
      $or: [
        { text: { $regex: new RegExp(searchQuery, "i") } },
        { date: { $regex: new RegExp(searchQuery, "i") } },
      ],
    },
  },
]

module.exports = searchNotePipeline
