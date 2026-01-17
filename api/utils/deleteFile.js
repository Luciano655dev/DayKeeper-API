const Media = require("../models/Media")
const fs = require("fs")

const deleteFile = async (props) => {
  let key = props?.key
  const type = props?.type

  let media = null

  if (type === "mediaId") {
    media = await Media.findById(key)
  } else if (key) {
    media = await Media.findOne({ key: String(key) })
  }

  if (!media) {
    console.log("deleteFile: media not found, skipping")
    return
  }

  // SOFT DELETE
  await Media.updateOne(
    { _id: media._id },
    {
      $set: {
        status: "deleted",
        deletedAt: new Date(),
        usedIn: null,
      },
    }
  )

  return
}

module.exports = deleteFile

/*
old
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
      console.log("not found at deleteFile")
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
        console.log(response)
      })
      .catch((response) => {
        console.log("deleteFile catch")
        console.log(response)
      })
  } else if (storageType === "local") {
    promisify(fs.unlink)(path.resolve(__dirname, "..", "tmp", "uploads", key))
  }

  await Media.deleteOne({ key })

  return
}
*/
module.exports = deleteFile
