const postInfoPipeline = require("../../common/postInfoPipeline")
const mongoose = require("mongoose")

const userPostsPipeline = (mainUser, name) => {
  const or = [{ "user_info.name": name }]

  if (mongoose.Types.ObjectId.isValid(name)) {
    or.push({ "user_info._id": new mongoose.Types.ObjectId(name) })
  }

  return [...postInfoPipeline(mainUser), { $match: { $or: or } }]
}

module.exports = userPostsPipeline
