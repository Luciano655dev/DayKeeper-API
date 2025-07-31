const AWS = require("aws-sdk")

const {
  success: { fetched },
} = require("../../../constants/index")

const {
  aws: { accessKeyId, secretAccessKey, defaultRegion },
} = require(`../../../config`)

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: defaultRegion,
})

const getJobStatus = async (req) => {
  const { jobId } = req.params

  try {
    const result = await rekognition
      .getContentModeration({
        JobId: jobId,
      })
      .promise()

    return fetched("Job Status", {
      data: {
        status: result.JobStatus,
        labels: result.ModerationLabels,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = getJobStatus
