const userInfoPipeline = require("../../common/userInfoPipeline")
const mongoose = require("mongoose")

const getUserPipeline = (userInput, mainUser) => [
  {
    $match: {
      $or: [
        { name: userInput },
        {
          _id: mongoose.Types.ObjectId.isValid(userInput)
            ? new mongoose.Types.ObjectId(userInput)
            : "",
        },
      ],
    },
  },
  ...userInfoPipeline(mainUser),
]

module.exports = getUserPipeline
