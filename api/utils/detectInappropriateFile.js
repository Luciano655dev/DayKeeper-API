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

    await Media.findByIdAndUpdate(mediaId, {
      jobId: res.JobId,
      status: "pending",
    })

    return true
  }

  return false
}

module.exports = detectInappropriateContent
