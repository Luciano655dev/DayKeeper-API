const Storie = require(`../../../models/Storie`)
const StorieLikes = require(`../../../models/StorieLikes`)
const StorieViews = require(`../../../models/StorieViews`)
const viewStorie = require("../general/viewStorie")
const populateOptions = require(`../../../utils/populateOptions`)
const { hideGeneralData } = require(`../../../repositories/index`)

const findStorieById = async ({
  storieId,
  fieldsToPopulate = [],
  loggedUserId,
  view = false,
}) => {
  try {
    // populate and view
    const pO = populateOptions(fieldsToPopulate)

    // find storie
    let storie = await Storie.findOneAndUpdate(
      { _id: storieId },
      {
        new: true,
        fields: hideGeneralData,
      }
    ).populate(pO)

    // view Storie
    if (view) await viewStorie(storie._id, loggedUserId)

    // get storie Info
    let newStorie = storie
    if (loggedUserId.toString() == storie.user._id.toString()) {
      const likeCounter = await StorieLikes.countDocuments({
        storieId: storie._id,
      })
      const hasLiked = await StorieLikes.exists({
        storieId: storie._id,
        userId: loggedUserId,
      })

      const viewCounter = await StorieViews.countDocuments({
        storieId: storie._id,
      })
      const hasViewed = await StorieViews.exists({
        storieId: storie._id,
        userId: loggedUserId,
      })
      newStorie = {
        ...newStorie._doc,
        likes: likeCounter,
        hasLiked: hasLiked ? true : false,
        views: viewCounter,
        hasViewed: hasViewed ? true : false,
      }
    }

    return newStorie
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findStorieById
