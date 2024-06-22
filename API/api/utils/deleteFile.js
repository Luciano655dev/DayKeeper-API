const {
  aws: {
    bucketName,
    storageType
  }
} = require(`../../config`)

const awsS3Config = require('../config/awsS3Config')

const deleteFile = (key) => {
  if (storageType === "s3"){
    awsS3Config
      .deleteObject({
        Bucket: bucketName,
        Key: key
      })
      .promise()
      .then(response => {
        console.log(response.status)
      })
      .catch(response => {
        console.log(response.status)
      })
  } else if(storageType === "local"){
    promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", key)
    )
  }
}

module.exports = deleteFile