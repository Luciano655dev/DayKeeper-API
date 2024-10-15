const CloseFriends = require(`../../../models/CloseFriends`)
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
    const storieUser = await findUser({ userInput, hideData: true })
    if (!storieUser) return null

    const pO = populateOptions(fieldsToPopulate)

    const stories = await Storie.find(
      { title: storieInput, user: storieUser._id },
      hideGeneralData
    ).populate(pO)

    const isInCF = await CloseFriends.exists({
      userId: storieUser.user,
      closeFriendId: loggedUserId,
    })
    stories = stories.filter(async (storie) => {
      return (
        storie.privacy === "public" ||
        storie.privacy == undefined ||
        (storie.privacy === "private" &&
          storie.user_info._id.equals(loggedUserId)) ||
        (storie.privacy === "close friends" && isInCF)
      )
    })

    if (view)
      await Promise.all(
        stories.map((story) => viewStorie(story._id, loggedUserId))
      )

    // If the storie user is the loggeduser, aggregate likes and views
    if (storieUser._id.toString() === loggedUserId.toString()) {
      const storieIds = stories.map((story) => story._id)

      const [likeCounts, viewCounts] = await Promise.all([
        StorieLikes.aggregate([
          { $match: { storieId: { $in: storieIds }, userId: loggedUserId } },
          { $group: { _id: "$storieId", count: { $sum: 1 } } },
        ]),
        StorieViews.aggregate([
          { $match: { storieId: { $in: storieIds }, userId: loggedUserId } },
          { $group: { _id: "$storieId", count: { $sum: 1 } } },
        ]),
      ])

      const likeMap = likeCounts.reduce((acc, { _id, count }) => {
        acc[_id] = count
        return acc
      }, {})

      const viewMap = viewCounts.reduce((acc, { _id, count }) => {
        acc[_id] = count
        return acc
      }, {})

      const newStories = stories.map((story) => {
        const likes = likeMap[story._id] || 0
        const views = viewMap[story._id] || 0

        return {
          ...story._doc,
          likes,
          hasLiked: likeMap[story._id] ? true : false,
          views,
          hasViewed: viewMap[story._id] ? true : false,
        }
      })

      return newStories
    }

    return stories
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = findStorieByDate
