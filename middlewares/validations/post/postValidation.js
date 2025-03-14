const Post = require("../../../api/models/Post")
const deleteFile = require("../../../api/utils/deleteFile")
const {
  errors: { serverError },
} = require("../../../constants/index")

const postValidation = async (req, res, next) => {
  const { data, privacy, emotion } = req.body
  const loggedUser = req.user
  const maxDataLength = 1000

  try {
    function handleBadRequest(errorCode, message) {
      /* Delete previous files */
      if (files) {
        for (let i in req.files) {
          deleteFile(req.files[i].key)
        }
      }

      return res.status(errorCode).json({ message })
    }

    /* Input Validations */
    if (!data) return handleBadRequest(400, `Data is not filled in`)

    if (data.length > maxDataLength)
      return handleBadRequest(413, `Text is too long`)

    /* One post per day */
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastPostToday = await Post.findOne({
      user: loggedUser._id,
      created_at: { $gte: today },
    })

    if (lastPostToday)
      return handleBadRequest(400, "You can only make one post per day")

    // Privacy
    switch (privacy) {
      case "public":
      case "private":
      case "close friends":
      case undefined:
        break
      default:
        return handleBadRequest(400, "Invalid privacy value")
    }

    /* Emotions */
    if (!emotion || emotion > 100 || emotion < 0 || isNaN(emotion))
      return handleBadRequest(400, "Invalid emotion value")

    console.log("next")

    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: serverError(error.message) })
  }
}

module.exports = postValidation
