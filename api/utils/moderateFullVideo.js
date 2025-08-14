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

const moderateFullVideo = async (key, mediaId) => {
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

  console.log(`JOB_ID --> ${res.JobId}`)

  await Media.findByIdAndUpdate(mediaId, {
    jobId: res.JobId,
    status: "pending",
  })

  return true
}

module.exports = moderateFullVideo
