const deleteFile = require("../../../api/utils/deleteFile")
const { serverError } = require("../../../constants/index")

const postEditValidation = async (req, res, next) => {
  const { data, privacy, emotion } = req.body
  const maxDataLength = 1000

  function handleBadRequest(errorCode, message) {
    /* Delete previous files */
    if (req.files) for (let i in req.files) deleteFile(req.files[i].key)

    return res.status(errorCode).json({ message })
  }

  try {
    if (data && data.length > maxDataLength)
      return handleBadRequest(413, `Text is too long`)

    // Privacy
    if (privacy) {
      switch (privacy) {
        case "public":
        case "private":
        case "close friends":
        case undefined:
          break
        default:
          return handleBadRequest(400, "Invalid privacy value")
      }
    }

    /* Emotions */
    if (
      emotion &&
      (emotion > 100 || emotion < 0 || !Number(emotion).isInteger())
    )
      return handleBadRequest(400, "Invalid emotion value")

    return next()
  } catch (error) {
    return handleBadRequest(500, serverError(error.message).message)
  }
}

module.exports = postEditValidation
