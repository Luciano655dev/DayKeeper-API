const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const fs = require("fs")
const multerS3 = require("multer-s3")
const awsS3Config = require("./awsS3Config")
const {
  aws: { bucketName, storageType },
} = require("../../config")

// Ensure local upload dir exists (for local use)
const uploadDir = path.resolve(__dirname, "..", "tmp", "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err)
        const fileName = `${hash.toString("hex")}-${file.originalname}`
        file.url = `/uploads/${fileName}`
        cb(null, fileName)
      })
    },
  }),

  s3: multerS3({
    s3: awsS3Config,
    bucket: bucketName,
    acl: "public-read", // Public file access via URL
    contentType: (req, file, cb) => {
      const mime = file.mimetype
      if (mime.startsWith("image/") || mime.startsWith("video/")) {
        cb(null, mime)
      } else {
        cb(new Error("Unsupported media type"))
      }
    },
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err)
        const fileName = `${hash.toString("hex")}-${file.originalname}`
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`
        file.url = fileUrl
        cb(null, fileName)
      })
    },
  }),
}

const fileSizeLimit = 4 * 1024 * 1024 * 1024 // 4 GB

const MulterConfig = (mediaType = "both") => {
  let allowedMimes = []

  switch (mediaType) {
    case "image":
      allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"]
      break
    case "both":
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
      break
    default:
      throw new Error("Unsupported media type")
  }

  return {
    dest: uploadDir,
    storage: storageTypes[storageType],
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
