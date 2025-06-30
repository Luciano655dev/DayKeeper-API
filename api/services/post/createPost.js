const Post = require("../../models/Post")
const Media = require("../../models/Media")
const updateStreak = require("../user/streak/updateStreak")
const deleteFile = require("../../utils/deleteFile")
const getPlaceById = require("../location/getPlaceById")

const {
  success: { created },
  errors: { serverError },
} = require("../../../constants/index")

const createPost = async (req) => {
  const { data, emotion, privacy } = req.body
  const loggedUser = req.user
  const placesIds = req?.body?.placesIds?.split(",") || []
  const mediaDocs = req?.mediaDocs

  try {
    // Add placeId to media if provided
    if (placesIds && placesIds.length > 0 && mediaDocs.length > 0) {
      for (let i in mediaDocs) {
        if (!placesIds[i]) continue

        const placeById = await getPlaceById({ placeId: placesIds[i] })
        if (placeById.code !== 200) continue

        mediaDocs[i].placeId = placesIds[i]
        await mediaDocs[i].save()
      }
    } else console.log("No place IDs...")

    // Create post with status 'pending' and link media
    const post = await Post.create({
      data,
      emotion,
      privacy,
      status: "pending",
      media: mediaDocs.map((m) => m._id),
      user: loggedUser._id,
      created_at: new Date(),
    })

    console.log("post created")

    // Link media to this post
    await Promise.all(
      mediaDocs.map((media) =>
        Media.findByIdAndUpdate(media._id, {
          usedIn: { model: "Post", refId: post._id },
        })
      )
    )

    await updateStreak(loggedUser)

    return created("post", { post })
  } catch (error) {
    for (let file of req.files || []) {
      await deleteFile(file.key)
    }

    console.error("Error creating post:", error)
    return serverError(error)
  }
}

module.exports = createPost
