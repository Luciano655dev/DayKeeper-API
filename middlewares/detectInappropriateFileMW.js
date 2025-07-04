const detectInappropriateContent = require(`../api/utils/detectInappropriateFile`)
const deleteFile = require(`../api/utils/deleteFile`)

const {
  errors: { serverError },
} = require("../constants/index")

async function detectInappropriateContentMW(req, res, next) {
  console.log("detecting innapropriate file...")
  const files = req?.file ? [req.file] : req.files

  if (!files) return next()

  try {
    for (let file of files) {
      const mediaType = file.mimetype.split("/")[0]
      const isAppropriate = await detectInappropriateContent(
        file.key,
        mediaType,
        file.mediaId
      )

      if (!isAppropriate) {
        deleteFile(file.key)
        return res
          .status(400)
          .json({ message: `This image violates DayKeeper's terms of service` })
      }
    }

    console.log("no innapropriate files")
    next()
  } catch (error) {
    for (let file of files) deleteFile(file.key)

    console.log(`error at detectInapropriateFileMW: ${error}`)
    return res.status(500).json({ message: serverError(error.message).message })
  }
}

module.exports = detectInappropriateContentMW
