const { Queue } = require("bullmq")
const IORedis = require("ioredis")

const {
  redis: { url: redisUrl },
} = require("../config")

const connection = new IORedis(redisUrl)

const moderationQueue = new Queue("moderationQueue", { connection })

connection.on("ready", () => {
  console.log(`\x1b[36mRedis connected successfully\x1b[0m`)
})

module.exports = moderationQueue
