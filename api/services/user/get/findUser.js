const User = require(`../../../models/User`)
const mongoose = require(`mongoose`)

const { hideUserData } = require("../../../repositories/index")

const findUser = async ({ userInput = "" }) => {
  try {
    let user = await User.findOne({ name: userInput }).select(hideUserData)
    if (!user && mongoose.Types.ObjectId.isValid(userInput))
      user = await User.findById(userInput).select(hideUserData)

    return user
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findUser
