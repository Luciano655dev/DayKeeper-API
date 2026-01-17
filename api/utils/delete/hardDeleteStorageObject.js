const fs = require("fs")
const path = require("path")
const { promisify } = require("util")

const {
  aws: { bucketName, storageType },
} = require("../../../config")

const awsS3Config = require("../../config/awsS3Config")

async function hardDeleteStorageObject(key) {
  if (!key) return

  if (storageType === "s3") {
    try {
      await awsS3Config
        .deleteObject({ Bucket: bucketName, Key: String(key) })
        .promise()
    } catch (err) {
      const code = err?.code || err?.name
      // idempotent
      if (code !== "NoSuchKey" && code !== "NotFound") throw err
    }
    return
  }

  if (storageType === "local") {
    try {
      await promisify(fs.unlink)(
        path.resolve(__dirname, "..", "tmp", "uploads", String(key))
      )
    } catch (err) {
      if (err?.code !== "ENOENT") throw err
    }
  }
}

module.exports = hardDeleteStorageObject
