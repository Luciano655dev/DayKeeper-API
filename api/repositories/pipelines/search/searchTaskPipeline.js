const taskInfoPipeline = require("../../common/day/tasks/taskInfoPipeline")
const mongoose = require("mongoose")

const searchTaskPipeline = (searchQuery, filterPipe, user, mainUser) => [
  ...taskInfoPipeline(mainUser),
  {
    $match: {
      $and: [
        { "user_info._id": new mongoose.Types.ObjectId(user._id) },

        filterPipe,
      ],

      // search
      $or: [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { date: { $regex: new RegExp(searchQuery, "i") } },
        { value: { $regex: new RegExp(searchQuery, "i") } },
      ],
    },
  },
]

module.exports = searchTaskPipeline
