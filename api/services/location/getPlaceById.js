const axios = require("axios")
const {
  google: { apiKey },
} = require("../../../config")

const {
  errors: { fieldNotFilledIn, invalidValue, inputTooLong, notFound },
  success: { fetched },
} = require("../../../constants/index")

const getPlacesNearby = async (props) => {
  const { placeId } = props

  if (!placeId) return fieldNotFilledIn("Place ID")
  if (placeId?.length > 100) return inputTooLong("Place ID")

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
    )

    if (response.data?.status == "NOT_FOUND") return notFound("Place")
    if (response.data?.status == "INVALID_REQUEST")
      return invalidValue("Place ID")

    return fetched("Place", { response })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getPlacesNearby
