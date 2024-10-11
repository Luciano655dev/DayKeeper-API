const axios = require("axios")
const {
  google: { apiKey },
} = require("../../../config")

const {
  location: { maxSearchLength },

  errors: { inputTooLong },
  success: { fetched },
} = require("../../../constants/index")

const searchPlace = async (props) => {
  const { q } = props

  if (q?.length > maxSearchLength) return inputTooLong("Search")

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&key=${apiKey}`
    )

    return fetched("Places", { response: response.data?.results })
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = searchPlace
