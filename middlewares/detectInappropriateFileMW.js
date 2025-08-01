const detectInappropriateContent = require("../api/utils/detectInappropriateFile")
const deleteFile = require("../api/utils/deleteFile")

const {
  errors: { serverError },
} = require("../constants/index")

async function detectInappropriateContentMW(req, res, next) {
  const files = req?.file ? [req.file] : req.files
  if (!files || !req.mediaDocs) return next()

  try {
    const trustScore = req.userTrustScore || 0

    for (let media of req.mediaDocs) {
      await detectInappropriateContent(
        media.key,
        media.type,
        media._id,
        trustScore
      )
    }

    next()
  } catch (error) {
    for (let media of req.mediaDocs) deleteFile(media.key)

    console.error(`error at detectInappropriateContentMW: ${error}`)
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = detectInappropriateContentMW
