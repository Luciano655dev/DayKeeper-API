const Storie = require(`../../../models/Storie`)
const StorieLikes = require(`../../../models/StorieLikes`)
const StorieViews = require(`../../../models/StorieViews`)
const findUser = require(`../../user/get/findUser`)
const viewStorie = require("../general/viewStorie")
const populateOptions = require(`../../../utils/populateOptions`)
const { hideGeneralData } = require(`../../../repositories/index`)

const findStorieByDate = async ({
  userInput,
  title: storieInput,
  fieldsToPopulate = [],
  loggedUserId,
  view = false,
}) => {
  try {
    // find user
    let storieUser = await findUser({ userInput, hideData: true })
    if (!storieUser) return null

    // populate
    const pO = populateOptions(fieldsToPopulate)

    // find storie
    let stories = await Storie.find(
      { title: storieInput, user: storieUser._id.toString() },
      hideGeneralData
    ).populate(pO)

    // view storie or not
    if (view)
      for (let i in stories) await viewStorie(stories[i]._id, loggedUserId)

    // get storie info
    const newStories = [...stories]
    if (storieUser._id.toString() == loggedUserId.toString()) {
      for (let i in stories) {
        const likeCounter = await StorieLikes.countDocuments({
          storieId: stories[i]._id,
        })
        const hasLiked = await StorieLikes.exists({
          storieId: stories[i]._id,
          userId: loggedUserId,
        })

        const viewCounter = await StorieViews.countDocuments({
          storieId: stories[i]._id,
        })
        const hasViewed = await StorieViews.exists({
          storieId: stories[i]._id,
          userId: loggedUserId,
        })

        newStories[i] = {
          ...newStories[i]._doc,
          likes: likeCounter,
          hasLiked: hasLiked ? true : false,
          views: viewCounter,
          hasViewed: hasViewed ? true : false,
        }
      }
    }

    return newStories
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findStorieByDate
