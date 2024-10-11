const Storie = require(`../../models/Storie`)
const getTodayDate = require(`../../utils/getTodayDate`)
const getPlaceById = require("../location/getPlaceById")

const {
  stories: { maxStoriesPerDay },
  errors: { maxQuantityToday },
  success: { created },
} = require("../../../constants/index")

const createStorie = async (props) => {
  const { text, file, placeId, loggedUser } = props

  try {
    const todayDate = getTodayDate()
    const todayStoriesCount = await Storie.countDocuments({ title: todayDate })

    if (todayStoriesCount >= maxStoriesPerDay)
      return maxQuantityToday(`Stories`)

    // check Place ID
    let hasValidPlaceId = false

    if (placeId) {
      const placeById = await getPlaceById({ placeId })
      if (placeId && placeById.code != 200) return invalidValue("Place ID")
      hasValidPlaceId = true
    }

    const newStorie = new Storie({
      title: `${todayDate}`,
      file,
      text,
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
