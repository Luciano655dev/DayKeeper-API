const { Worker } = require("bullmq")
const IORedis = require("ioredis")
const fs = require("fs")
const path = require("path")
const AWS = require("aws-sdk")
const Media = require("../api/models/Media")
const Post = require("../api/models/Post")
const Storie = require("../api/models/Storie")
const generateVideoThumbnails = require("../api/utils/generateVideoThumbnails")

/* Imports and Config */
const { inappropriateLabels } = require("../constants/index")
const {
  redis: { url: redisUrl },
  aws: { accessKeyId, secretAccessKey, defaultRegion, bucketName },
} = require("../config")

AWS.config.update({ accessKeyId, secretAccessKey, region: defaultRegion })
const rekognition = new AWS.Rekognition()
const s3 = new AWS.S3()
const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
})

const updateMedia = async (mediaId, isSafe) => {
  try {
    newStatus = isSafe ? "public" : "rejected"
    console.log(`media ${mediaId} is ${newStatus}`)

    const media = await Media.findByIdAndUpdate(mediaId, {
      status: newStatus,
      verified: true,
    })
    if (!media) return

    if (media?.usedIn?.model == "Post") {
      await Post.findByIdAndUpdate(media?.usedIn?.refId, {
        status: newStatus,
      })
    } else if (media?.usedIn?.model == "Storie") {
      await Storie.findByIdAndUpdate(media?.usedIn?.refId, {
        status: newStatus,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

// Main Worker
const worker = new Worker(
  "moderationQueue",
  async (job) => {
    const { key, type, mediaId } = job.data
    const tempDir = path.join(__dirname, "..", "tmp", "thumbs")
    console.log(`worker iniciado para ${mediaId}`)

    if (type === "image") {
      const res = await rekognition
        .detectModerationLabels({
          Image: { S3Object: { Bucket: bucketName, Name: key } },
        })
        .promise()

      const isSafe = res.ModerationLabels.every(
        (label) =>
          !inappropriateLabels.includes(label.Name) || label.Confidence < 90
      )

      await updateMedia(mediaId, isSafe)

      return
    }

    // Vídeo
    const videoPath = path.join(
      tempDir,
      `${Date.now()}-${key.split("/").pop()}`
    )
    const s3File = await s3
      .getObject({ Bucket: bucketName, Key: key })
      .promise()
    fs.writeFileSync(videoPath, s3File.Body)

    const thumbs = await generateVideoThumbnails(videoPath, tempDir)
    let isSafe = true

    for (const thumb of thumbs) {
      const buffer = fs.readFileSync(thumb)
      const res = await rekognition
        .detectModerationLabels({ Image: { Bytes: buffer } })
        .promise()

      const hasBadLabel = res.ModerationLabels.some(
        (label) =>
          inappropriateLabels.includes(label.Name) && label.Confidence >= 90
      )

      if (hasBadLabel) {
        isSafe = false
        break
      }
    }

    fs.unlinkSync(videoPath)
    thumbs.forEach((thumb) => fs.unlinkSync(thumb))

    await updateMedia(mediaId, isSafe)
  },
  { connection }
)

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err)
})
