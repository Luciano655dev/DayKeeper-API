const Post = require("../../models/Post")
const deleteFile = require("../../utils/deleteFile")
const findPost = require("./get/findPost")
const getPlaceById = require("../location/getPlaceById")
const {
  errors: { notFound, inputTooLong },
  success: { updated },
} = require("../../../constants/index")

const updatePost = async (props) => {
  // TODO: review this
  const placesIds = props?.placesIds?.split(",") || []
  const {
    data,
    keep_files: keepFilesFromProps,
    title, // req.params
    loggedUser, // req.user
    reqFiles, // req.files
  } = props

  try {
    // find Post
    const post = await findPost({
      userInput: loggedUser._id,
      title,
      type: "userId",
      fieldsToPopulate: ["user"],
    })
    if (!post) throw new Error(notFound("Post").message)

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

    /* Create Post */
    const updatedPost = await Post.findOneAndUpdate(
      { title: title, user: loggedUser._id },
      {
        $set: {
          data: data || post.data,
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
    for (let i in newFiles) deleteFile(newFiles[i].key)

    throw new Error(error.message)
  }
}

module.exports = updatePost
