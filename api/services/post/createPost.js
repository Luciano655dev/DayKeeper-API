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
    if (placesIds && placesIds.length > 0 && mediaDocs.length > 0) {
      for (let i in mediaDocs) {
        if (!placesIds[i]) continue

        const placeById = await getPlaceById({ placeId: placesIds[i] })
        if (placeById.code !== 200) continue

        mediaDocs[i].placeId = placesIds[i]
        await mediaDocs[i].save()
      }
    }

    const post = await Post.create({
      date: new Date(),
      data,
      emotion,
      privacy,
      status: mediaDocs
        ? mediaDocs.reduce((acc, media) => {
            return acc && media.status === "public"
          }, true)
          ? "public"
          : "pending"
        : "public",
      media: mediaDocs ? mediaDocs.map((m) => m._id) : [],
      user: loggedUser._id,
      created_at: new Date(),
    })

    // Link media to the post
    if (mediaDocs)
      await Promise.all(
        mediaDocs.map((media) =>
          Media.findByIdAndUpdate(media._id, {
            usedIn: { model: "Post", refId: post._id },
          })
        )
      )

    /* Update streak */
    await updateStreak(loggedUser)

    return created("post", { post })
  } catch (error) {
    for (let mediaDoc of req.mediaDocs || []) {
      await deleteFile({ key: mediaDoc.key })
    }

    console.error("Error creating post:", error)
    return serverError(error)
  }
}

module.exports = createPost
