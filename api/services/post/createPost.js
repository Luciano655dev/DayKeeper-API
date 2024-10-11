const Post = require("../../models/Post")
const getTodayDate = require(`../../utils/getTodayDate`)
const deleteFile = require("../../utils/deleteFile")
const getPlaceById = require("../location/getPlaceById")

const {
  success: { created },
} = require("../../../constants/index")

const createPost = async (props) => {
  const { data, loggedUser, files } = props
  const placesIds = props?.placesIds?.split(",") || []
  const title = getTodayDate()

  try {
    // check Place
    if (placesIds && placesIds?.length > 0) {
      for (let i in files) {
        if (!placesIds[i]) continue

        const placeById = await getPlaceById({ placeId: placesIds[i] })
        if (placesIds && placeById.code !== 200) continue

        files[i].placeId = placesIds[i]
      }
    }

    /* Create post */
    const post = new Post({
      title,
      data,
      files,
      placeId: hasValidPlaceId ? placeId : undefined,
      user: loggedUser._id,
      created_at: Date.now(),
    })

    await post.save()

    return created(`post`, { post })
  } catch (error) {
    /* Delete previous files */
    for (let i in req.files) deleteFile(req.files[i].key)

    throw new Error(error.message)
  }
}

module.exports = createPost
