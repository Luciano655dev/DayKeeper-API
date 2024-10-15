const Storie = require(`../../../models/Storie`)
const StorieLikes = require(`../../../models/StorieLikes`)
const StorieViews = require(`../../../models/StorieViews`)
const viewStorie = require("../general/viewStorie")
const populateOptions = require(`../../../utils/populateOptions`)
const { hideGeneralData } = require(`../../../repositories/index`)
const CloseFriends = require("../../../models/CloseFriends")

const findStorieById = async ({
  storieId,
  fieldsToPopulate = [],
  loggedUserId,
  view = false,
}) => {
  try {
    const pO = populateOptions(fieldsToPopulate)
    const storie = await Storie.findOne({ _id: storieId }, hideGeneralData)
      .populate(pO)
      .lean()

    if (!storie) throw new Error("Storie not found")

    // privacy
    if (storie.privacy != "public" && storie.privacy != undefined) {
      const isInCF = await CloseFriends.exists({
        userId: storieUser.user,
        closeFriendId: loggedUserId,
      })

      if (
        (storie.privacy === "private" &&
          storie.user_info._id.equals(loggedUserId)) ||
        (storie.privacy === "close friends" && isInCF)
      )
        return
    }

    // View Storie if required
    if (view) await viewStorie(storie._id, loggedUserId)

    if (loggedUserId.equals(storie.user)) {
      const [likeCounter, hasLiked, viewCounter, hasViewed] = await Promise.all(
        [
          StorieLikes.countDocuments({ storieId: storie._id }),
          StorieLikes.exists({ storieId: storie._id, userId: loggedUserId }),
          StorieViews.countDocuments({ storieId: storie._id }),
          StorieViews.exists({ storieId: storie._id, userId: loggedUserId }),
        ]
      )

      return {
        ...storie,
        likes: likeCounter,
        hasLiked: Boolean(hasLiked),
        views: viewCounter,
        hasViewed: Boolean(hasViewed),
      }
    }

    return storie
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findStorieById
