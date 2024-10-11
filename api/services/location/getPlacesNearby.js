const axios = require("axios")
const {
  google: { apiKey },
} = require("../../../config")

const {
  location: { defaultRadius, defaultLat, defaultLng, defaultType },
  success: { fetched },
} = require("../../../constants/index")

const getPlacesNearby = (props) => {
  const { lat, lng, radius } = props

  try {
    const response = axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        lat || defaultLat
      },${lng || defaultLng}&radius=${
        radius || defaultRadius
      }&type=${defaultType}&key=${apiKey}`
    )

    return fetched("Places Nearby", { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPlacesNearby
