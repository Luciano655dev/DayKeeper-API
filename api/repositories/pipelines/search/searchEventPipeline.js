const eventInfoPipeline = require("../../common/day/events/eventInfoPipeline")
const mongoose = require("mongoose")

const searchEventPipeline = (searchQuery, filterPipe, user, mainUser) => [
  ...eventInfoPipeline(mainUser),
  {
    $match: {
      $and: [
        { "user_info._id": new mongoose.Types.ObjectId(user._id) },

        filterPipe,
      ],

      // search
      $or: [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
        { dateStart: { $regex: new RegExp(searchQuery, "i") } },
        { dateEnd: { $regex: new RegExp(searchQuery, "i") } },
      ],
    },
  },
  {
    $project: {
      _id: 1,
      title: 1,
      description: 1,
      dateStart: 1,
      dateEnd: 1,
      location: 1,
      user: 1,
      user_info: 1,
      created_at: 1,
    },
  },
]

module.exports = searchEventPipeline
