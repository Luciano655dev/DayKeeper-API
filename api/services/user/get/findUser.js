const User = require(`../../../models/User`)
const mongoose = require(`mongoose`)

const { hideUserData } = require("../../../repositories/index")

const findUser = async ({
  userInput = "",
  fieldsToPopulate = [],
  hideData = false,
}) => {
  try {
    const populateOptions = fieldsToPopulate.map((field) => ({
      path: field,
      match: { banned: { $ne: true } },
      select: hideUserData,
    }))
    const hideDataObj = hideData ? hideUserData : {}

    let user = await User.findOne({ name: userInput })
      .select(hideDataObj)
      .populate(populateOptions)
    if (!user && mongoose.Types.ObjectId.isValid(userInput))
      user = await User.findById(userInput)
        .select(hideDataObj)
        .populate(populateOptions)

    return user
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findUser
