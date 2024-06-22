const {
  aws: {
    defaultRegion,
    accessKeyId,
    secretAccessKey
  }
} = require(`../../config`)
const aws = require('aws-sdk')

let awsS3Config = new aws.S3({
  region: `us-east-1`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
})

module.exports = awsS3Config