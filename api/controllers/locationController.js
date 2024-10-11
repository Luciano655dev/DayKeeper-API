const searchPlace = require("../services/location/searchPlace")
const getPlacesNearby = require("../services/location/getPlacesNearby")
const getPlaceById = require("../services/location/getPlaceById")

const getPlacesNearbyController = async (req, res) => {
  try {
    const { code, message, response } = await getPlacesNearby({
      ...req.query, // lat, lng, radius
      // the type is default now
    })

    return res.status(code).json({ message, response })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const getPlaceByIdController = async (req, res) => {
  try {
    const { code, message, response } = await getPlaceById({
      ...req.params, // placeId
    })

    return res.status(code).json({ message, result: response })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

const searchPlaceController = async (req, res) => {
  try {
    const { code, message, response } = await searchPlace({
      ...req.query, // search q
    })

    return res.status(code).json({ message, result: response })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

module.exports = {
  getPlacesNearby: getPlacesNearbyController,
  getPlaceById: getPlaceByIdController,
  searchPlace: searchPlaceController,
}

// https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}
