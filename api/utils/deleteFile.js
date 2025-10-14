const Media = require("../models/Media")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")

const {
  aws: { bucketName, storageType },
} = require(`../../config`)

const awsS3Config = require("../config/awsS3Config")

const deleteFile = async (props) => {
  let key = props?.key
  const type = props?.type

  if (type == "mediaId") {
    const media = await Media.findById(key)
    if (!media) {
      console.log("not found")
      return
    }

    key = media._id
  }

  if (storageType === "s3") {
    awsS3Config
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise()
      .then((response) => {
        console.log(response.status)
      })
      .catch((response) => {
        console.log(response.status)
      })
  } else if (storageType === "local") {
    promisify(fs.unlink)(path.resolve(__dirname, "..", "tmp", "uploads", key))
  }

  await Media.deleteOne({ key })

  return
}

module.exports = deleteFile
