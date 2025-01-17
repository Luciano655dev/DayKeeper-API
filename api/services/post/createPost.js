const Post = require("../../models/Post")
const getTodayDate = require(`../../utils/getTodayDate`)
const deleteFile = require("../../utils/deleteFile")
const getPlaceById = require("../location/getPlaceById")

const {
  success: { created },
} = require("../../../constants/index")

const createPost = async (props) => {
  // privacy = undefined, public, private or close friends
  const { data, loggedUser, files, emotion, privacy } = props
  const placesIds = props?.placesIds?.split(",") || []

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
      date: new Date(), // change for multiple posts in the future
      data,
      files,
      privacy,
      emotion,
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
