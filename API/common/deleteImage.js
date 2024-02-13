const awsS3Config = require('../config/awsS3Config')

const deleteImage = (key) => {
    if (process.env.STORAGE_TYPE === "s3"){
      awsS3Config
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: key
        })
        .promise()
        .then(response => {
          console.log(response.status)
        })
        .catch(response => {
          console.log(response.status)
        })
    } else if(process.env.STORAGE_TYPE === "local"){
      promisify(fs.unlink)(
        path.resolve(__dirname, "..", "tmp", "uploads", key)
      )
    }
}

module.exports = deleteImage