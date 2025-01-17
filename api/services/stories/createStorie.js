const Storie = require(`../../models/Storie`)
const getPlaceById = require("../location/getPlaceById")

const {
  stories: { maxStoriesPerDay },
  errors: { maxQuantityToday, invalidValue },
  success: { created },
} = require("../../../constants/index")

const createStorie = async (props) => {
  const { text, file, placeId, privacy, loggedUser } = props

  try {
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

    const newStorie = new Storie({
      date: new Date(),
      file,
      text,
      privacy,
      placeId: hasValidPlaceId ? placeId : undefined,
      user: loggedUser._id,
      created_at: new Date(),
    })

    await newStorie.save()

    return created("Storie", { storie: newStorie })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = createStorie
