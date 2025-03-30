const postInfoPipeline = require("../../common/postInfoPipeline")
const mongoose = require("mongoose")

const userPostsPipeline = (mainUser, name) => [
  ...postInfoPipeline(mainUser),
  {
    $match: {
      $or: [
        { "user_info.name": name },
        mongoose.Types.ObjectId.isValid(name)
          ? { "user_info._id": new mongoose.Types.ObjectId(name) }
          : {},
      ],
    },
  },
]

module.exports = userPostsPipeline
