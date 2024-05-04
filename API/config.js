require('dotenv').config()

module.exports = {
    secret: process.env.SECRET,
    mongodb: {
        dbUser: process.env.DB_USER,
        dbPass: process.env.DB_PASS,
    },
    aws: {
        bucketName: process.env.BUCKET_NAME,
        acessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        defaultRegion: process.env.AWS_DEFAULT_REGION,
        storageType: process.env.STORAGE_TYPE
    },
    mail: {
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        secret: process.env.EMAIL_SECRET,
    },
};