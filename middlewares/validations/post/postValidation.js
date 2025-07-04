const deleteFile = require("../../../api/utils/deleteFile")
const {
  errors: { serverError },
} = require("../../../constants/index")

const postValidation = async (req, res, next) => {
  const { data, privacy, emotion } = req.body
  const files = req?.files
  const maxDataLength = 1000

  try {
    function handleBadRequest(errorCode, message) {
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
    if (emotion && (emotion > 100 || emotion < 0))
      return handleBadRequest(400, "Invalid emotion value")
    return next()
  } catch (error) {
    console.log("post Validation Error")
    console.log(error)
    return res.status(500).json({ message: serverError(error.message) })
  }
}

module.exports = postValidation
