const AWS = require(`aws-sdk`)
const { inappropriateLabels } = require(`../../constants/index`)
const Media = require("../models/Media")
const {
  aws: {
    accessKeyId,
    secretAccessKey,
    defaultRegion,
    bucketName,
    snsTopicArn,
    rekogRoleArn,
  },
} = require(`../../config`)

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: defaultRegion,
})

const rekognition = new AWS.Rekognition() // dont put that damn line before the config

const detectInappropriateContent = async (key, type = "image", mediaId) => {
  console.time("DetectInnapripriateContent")
  if (type === "image") {
    const response = await rekognition
      .detectModerationLabels({
        Image: { S3Object: { Bucket: bucketName, Name: key } },
      })
      .promise()

    for (let label of response.ModerationLabels) {
      console.log(`Image Label: ${label.Name}, Confidence: ${label.Confidence}`)
      if (inappropriateLabels.includes(label.Name) && label.Confidence > 90) {
        return false
      }
    }

    await Media.findByIdAndUpdate(mediaId, { status: "public" })
    return true
  }

  if (type === "video") {
    const res = await rekognition
      .startContentModeration({
        Video: {
          S3Object: { Bucket: bucketName, Name: key },
        },
        NotificationChannel: {
          SNSTopicArn: snsTopicArn,
          RoleArn: rekogRoleArn,
        },
      })
      .promise()

    const checkJob = await rekognition
      .getContentModeration({
        JobId: res.jobId,
      })
      .promise()
    console.log(`${checkJob.jobStatus} --> ${res.JobId}`)
    await Media.findByIdAndUpdate(mediaId, {
      jobId: res.JobId,
      status: "pending",
    })
    console.timeEnd("DetectInnapripriateContent")

    return true
  }

  return false
}

module.exports = detectInappropriateContent
