const Storie = require("../../../models/Storie")
const StorieViews = require("../../../models/StorieViews")

const viewStorie = async (storieId, userId) => {
  try {
    const storie = await Storie.findById(storieId).populate("user")
    if (!storie) return null

    const viewRelation = await StorieViews.exists({
      storieId: storie._id,
      storieUserId: storie.user._id,
      userId,
    })
    if (!viewRelation)
      await StorieViews.create({
        storieId: storie._id,
        storieUserId: storie.user._id,
        userId,
      })

    return
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = viewStorie
