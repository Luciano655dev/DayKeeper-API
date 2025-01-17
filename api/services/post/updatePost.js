const Post = require("../../models/Post")
const deleteFile = require("../../utils/deleteFile")
const getPost = require("./getPost")
const getPlaceById = require("../location/getPlaceById")

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
    postId, // req.params
    loggedUser, // req.user
    reqFiles, // req.files
  } = props
  const keepFilesFromProps = props?.keep_files || ""

  try {
    // find Post
    let post
    const postResponse = await getPost({ postId, loggedUser })

    if (postResponse.code == 200) {
      post = postResponse.data
    } else return notFound("Post")

    /* Verify File Limit */
    const keep_files = keepFilesFromProps.split("").map(Number) || []
    const maxFiles =
      post.files.length -
      1 -
      (post.files.length - keep_files.length) +
      reqFiles.length
    if (maxFiles >= 5) throw new Error(inputTooLong(`image field`).message)

    /* Delete files from original post */
    let files = post.files

    for (let i = 0; i < post.files.length; i++) {
      if (keep_files.includes(i)) continue

      deleteFile(post.files[i].key)
    }

    /* Verify Privacy */
    if (privacy && post?.privacy != privacy) {
      switch (privacy) {
        case "private":
        case "close_friends":
          deletePostLikes(post._id)
          deletePostComments(post._id)
          deleteCommentLikes(post._id)
          break
        case "public":
        default:
          break
      }
    }

    const newPostfiles = files.filter((el, index) => keep_files.includes(index))
    const newFiles = reqFiles.map((file) => {
      return {
        name: file.originalname,
        key: file.key,
        mimetype: file.mimetype,
        url: file.url,
      }
    })
    files = [...newPostfiles, ...newFiles]

    /* Verify Place ID */
    if (placesIds && placesIds?.length > 0) {
      for (let i in files) {
        if (!placesIds[i]) continue

        const placeById = await getPlaceById({ placeId: placesIds[i] })
        if (placesIds && placeById.code !== 200) continue

        files[i].placeId = placesIds[i]
      }
    }

    /* Update Post */
    const updatedPost = await Post.findOneAndUpdate(
      { _id: post._id },
      {
        $set: {
          data: data || post.data,
          privacy: privacy || post?.privacy,
          emotion: emotion || post?.emotion,
          files,

          edited_at: Date.now(),
        },
      },
      { new: true }
    )

    // Debug
    if (JSON.stringify(post) == JSON.stringify(updatedPost))
      return { code: 204, message: "The haven't changed" }

    await updatedPost.save()

    return updated(`post`)
  } catch (error) {
    console.log(error)
    for (let i in newFiles) deleteFile(newFiles[i].key)

    throw new Error(error.message)
  }
}

module.exports = updatePost
