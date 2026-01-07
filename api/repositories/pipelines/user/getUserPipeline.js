const mongoose = require("mongoose")
const userInfoPipeline = require("../../common/userInfoPipeline")

function buildUserMatch(userInput) {
  const or = [{ name: userInput }]

  if (mongoose.Types.ObjectId.isValid(userInput)) {
    or.push({ _id: new mongoose.Types.ObjectId(userInput) })
  }

  return { $or: or }
}

const getUserPipeline = (userInput, mainUser) => [
  { $match: buildUserMatch(userInput) },
  ...userInfoPipeline(mainUser),
]

module.exports = getUserPipeline
