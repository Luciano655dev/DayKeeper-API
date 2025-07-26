const Storie = require(`../../models/Storie`)
const Media = require(`../../models/Media`)
const getPlaceById = require("../location/getPlaceById")

const {
  stories: { maxStoriesPerDay, maxStorieTextLength, inputTooLong },
  errors: { maxQuantityToday, invalidValue, fieldNotFilledIn },
  success: { created },
} = require("../../../constants/index")

const createStorie = async ({
  text,
  mediaDocs,
  placeId,
  privacy,
  loggedUser,
}) => {
  const mediaDoc = mediaDocs[0] ? mediaDocs[0] : null
  if (!mediaDoc) return fieldNotFilledIn("Media")
  if (text?.length > maxStorieTextLength) return inputTooLong("Text")

  try {
    /* Check stories daily max quantity */
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const todayStoriesCount = await Storie.countDocuments({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    if (todayStoriesCount >= maxStoriesPerDay)
      return maxQuantityToday(`Stories`)

    //  Check Privacy
    switch (privacy) {
      case "public":
      case "private":
      case "close friends":
      case undefined:
        break
      default:
        return invalidValue("Privacy")
    }

    // check Place ID
    let hasValidPlaceId = false

    if (placeId) {
      const placeById = await getPlaceById({ placeId })
      if (placeId && placeById.code != 200) return invalidValue("Place ID")
      hasValidPlaceId = true
    }

    /* Create Storie */
    const storie = await Storie.create({
      date: new Date(),
      media: mediaDoc._id,
      text,
      privacy,
      placeId: hasValidPlaceId ? placeId : null,
      status: mediaDoc?.status == "public" ? "public" : "pending",
      user: loggedUser._id,
      created_at: new Date(),
    })

    /* Link Media to the storie */
    if (mediaDocs) {
      await Promise.all(
        mediaDocs.map((media) =>
          Media.findByIdAndUpdate(media._id, {
            usedIn: { model: "Storie", refId: storie._id },
          })
        )
      )
    }

    return created("Storie", { storie: storie })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = createStorie
