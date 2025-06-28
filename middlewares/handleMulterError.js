const deleteImage = require("../api/utils/deleteFile")
const multer = require("multer")

const handleMulterError = (err, req, res, next) => {
  console.log("Handle Multer Error")
  console.log(req?.files)

  if (err instanceof multer.MulterError) {
    console.log("Multer Error")
    if (req?.files) for (let i in req.files) deleteImage(req.files[i].key)
    else if (req?.file) deleteImage(req.file.key)

    return res
      .status(400)
      .json({ error: "Error uploading files", message: err.message })
  }
  console.log("No Multer Error")

  return next()
}

module.exports = handleMulterError
