const User = require(`../../../models/User`)
const mongoose = require(`mongoose`)

const { hideUserData } = require("../../../repositories/index")

const findUser = async ({ userInput = "" }) => {
  try {
    let user = await User.findOne({
      username: userInput,
      status: { $ne: "deleted" },
    }).select(hideUserData)
    if (!user && mongoose.Types.ObjectId.isValid(userInput))
      user = await User.findOne({
        _id: userInput,
        status: { $ne: "deleted" },
      }).select(hideUserData)

    return user
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findUser
