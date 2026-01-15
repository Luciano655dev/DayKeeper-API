const Post = require("../../models/Post")
const Media = require("../../models/Media")
const deleteFile = require("../../utils/deleteFile")
const getPost = require("./getPost")

const deletePostLikes = require("./delete/deletePostLikes")
const deletePostComments = require("./delete/deletePostComments")
const deleteCommentLikes = require("./delete/deleteCommentLikes")

const {
  errors: { notFound, inputTooLong },
  success: { updated },
} = require("../../../constants/index")

const updatePost = async (props) => {
  const placesIds = props?.placesIds?.split(",") || []
  const {
    data,
    privacy,
    emotion,
    postId,
    loggedUser,
    mediaDocs = [], // novas mídias (req.mediaDocs)
    keepMediaIds = [], // mídias que o usuário quer manter
  } = props

  try {
    // 1. Get Post
    const postResponse = await getPost({ postId, loggedUser })
    if (postResponse.code !== 200) return notFound("Post")
    const post = postResponse.data

    // 2. Look for old medias that will be keeped in the post
    const mediaToKeep = await Media.find({ _id: { $in: keepMediaIds } })

    //  3. Verify if the total number is still in the limit
    const totalAfterUpdate = mediaToKeep.length + mediaDocs.length
    if (totalAfterUpdate > 5) {
      throw new Error(inputTooLong("media field").message)
    }

    // 4. Delete Media that user don't want
    const mediaToDelete = await Media.find({
      _id: { $in: post.media },
      _id: { $nin: keepMediaIds },
    })

    for (let media of mediaToDelete) {
      await deleteFile({ key: media.key })
      await media.deleteOne()
    }

    // 5. Link placeIds to medias
    if (placesIds.length > 0) {
      for (let i in mediaDocs) {
        if (!placesIds[i]) continue
        const place = await getPlaceById({ placeId: placesIds[i] })
        if (place.code === 200) {
          mediaDocs[i].placeId = placesIds[i]
          await mediaDocs[i].save()
        }
      }
    }

    // 6. Link post to new medias
    if (mediaDocs.length) {
      await Promise.all(
        mediaDocs.map((media) =>
          Media.findByIdAndUpdate(media._id, {
            usedIn: { model: "Post", refId: post._id },
          })
        )
      )
    }

    // 7. Calculate new Post Status
    const allMedia = [...mediaToKeep, ...mediaDocs]
    const postStatus = allMedia.every((m) => m.status === "public")
      ? "public"
      : "pending"

    // 8. If the privacy changed, delete al previous interactions
    if (privacy && post.privacy !== privacy) {
      if (["private", "close_friends"].includes(privacy)) {
        await deletePostLikes(post._id)
        await deletePostComments(post._id)
        await deleteCommentLikes(post._id)
      }
    }

    // 9. Update Post
    post.data = data ?? post.data
    post.privacy = privacy ?? post.privacy
    post.emotion = emotion ?? post.emotion
    post.media = allMedia.map((m) => m._id)
    post.status = postStatus
    post.edited_at = Date.now()

    await post.save()

    return updated("post")
  } catch (error) {
    console.error(error)
    for (let media of mediaDocs) {
      await deleteFile({ key: media.key })
    }
    throw new Error(error.message)
  }
}

module.exports = updatePost
