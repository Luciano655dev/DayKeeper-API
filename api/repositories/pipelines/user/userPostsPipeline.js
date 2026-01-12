const postInfoPipeline = require("../../common/postInfoPipeline")
const mongoose = require("mongoose")

const userPostsPipeline = (mainUser, username) => {
  const or = [{ "user_info.username": username }]

  if (mongoose.Types.ObjectId.isValid(username)) {
    or.push({ "user_info._id": new mongoose.Types.ObjectId(username) })
  }

  return [...postInfoPipeline(mainUser), { $match: { $or: or } }]
}

module.exports = userPostsPipeline
