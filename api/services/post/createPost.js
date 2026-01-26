const Post = require("../../models/Post")
const Media = require("../../models/Media")
const updateStreak = require("../user/streak/updateStreak")
const deleteFile = require("../../utils/deleteFile")

const {
  success: { created },
  errors: { serverError },
} = require("../../../constants/index")

const createPost = async (req) => {
  const { data, emotion, privacy } = req.body
  const loggedUser = req.user

  const mediaDocs = Array.isArray(req.mediaDocs) ? req.mediaDocs : []

  try {
    const allMediaPublic = mediaDocs.length
      ? mediaDocs.every((m) => m.status === "public")
      : true

    const post = await Post.create({
      date: new Date(),
      data,
      emotion,
      privacy,
      status: allMediaPublic ? "public" : "pending",
      media: mediaDocs.map((m) => m._id),
      user: loggedUser._id,
      created_at: new Date(),
    })

    if (mediaDocs.length) {
      await Promise.all(
        mediaDocs.map((media) =>
          Media.findByIdAndUpdate(media._id, {
            usedIn: { model: "Post", refId: post._id },
          }),
        ),
      )
    }

    await updateStreak(loggedUser._id, loggedUser?.timeZone)

    return created("post", { post })
  } catch (error) {
    for (let mediaDoc of mediaDocs) {
      await deleteFile({ key: mediaDoc.key }).catch(() => null)
    }
    console.error("Error creating post:", error)
    return serverError(error)
  }
}

module.exports = createPost
