const AWS = require(`aws-sdk`)
const {
  aws: {
    accessKeyId,
    secretAccessKey,
    defaultRegion
  }
} = require(`../../config`)

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: defaultRegion
});

const rekognition = new AWS.Rekognition()

const {
  aws: {
    bucketName
  }
} = require(`../../config`)

const detectInappropriateContent = async (imageKey, type = `image`) => {
  const params = type == `image` ? {
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: imageKey
      }
    }
  } : {
    Video: {
      S3Object: {
        Bucket: bucketName,
        Name: imageKey
      }
    }
  }

  try {
    const response = await rekognition.detectModerationLabels(params).promise()
    const inappropriateLabels = [
      'Explicit',
      'Exposed Female Genitalia',
      'Explicit Nudity',
      'Explicit Nudity',
      'Exposed Male Genitalia',
      'Exposed Buttocks or Anus',
      'Violence'
    ]

    for(let label of response.ModerationLabels){
      // log
      console.log(`Label: ${label.Name}, Confidence: ${label.Confidence}`)

      if (inappropriateLabels.includes(label.Name) && label.Confidence > 90){
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error detecting moderation labels:', error)
    throw error
  }
}

module.exports = detectInappropriateContent