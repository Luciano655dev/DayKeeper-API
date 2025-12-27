const Media = require("../../models/Media")
const getUser = require("../user/getUser")

const {
  errors: { invalidValue, inputTooLong, notFound },
  success: { fetched },
} = require("../../../constants/index")

const getMediaById = async (props) => {
  const { loggedUser, mediaId } = props

  if (mediaId?.length > 100) return inputTooLong("Media ID")

  try {
    const media = await Media.findById(mediaId)
    const mediaUser = await getUser({ name: media?.user || "", loggedUser })
    if (!media || !mediaUser) return notFound("Media")

    return fetched("Media", { media })
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = getMediaById
