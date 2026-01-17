const deleteImage = require("../api/utils/deleteFile")
const multer = require("multer")

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err.message)
    console.lor(err)

    if (req?.file) {
      const key = req.file.key || req.file.filename
      if (key) deleteImage({ key })
    }

    if (req?.files) {
      const filesArray = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat()

      for (const file of filesArray) {
        const key = file.key || file.filename
        if (key) deleteImage(key)
      }
    }

    return res.status(400).json({
      error: "Error uploading files",
      message: err.message,
    })
  }

  if (err) {
    console.error("Unexpected error:", err.message)
    return res.status(500).json({
      error: "Unexpected server error",
      message: err.message,
    })
  }

  return next()
}

module.exports = handleMulterError
