const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const multerS3 = require("multer-s3")
const awsS3Config = require("./awsS3Config")

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "temp", "uploads"))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err)

        file.key = `${hash.toString("hex")}-${file.originalname}`

        cb(null, file.key)
      })
    },
  }),
  s3: multerS3({
    s3: awsS3Config,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err)

        const fileName = `${hash.toString("hex")}-${file.originalname}`

        cb(null, fileName)
      })
    },
  }),
}

const fileSizeLimit = 4 * 1024 * 1024 * 1024 // 4 GB

const MulterConfig = (mediaType) => {
  let allowedMimes = []

  if (mediaType === "image") {
    allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      // "image/gif"
    ]
  } else if (mediaType === "both") {
    allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
    ]
  }

  return {
    dest: path.resolve(__dirname, "..", "tmp", "uploads"),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
      fileSize: fileSizeLimit,
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error("Invalid file type."))
      }
    },
  }
}

module.exports = MulterConfig